import { calculateBilling, toCents } from "@/lib/billing";
import { requireApiPermission } from "@/lib/api-auth";
import { prisma } from "@/lib/db";
import { orderReceiptInclude, serializeReceipt } from "@/lib/orders";
import { checkoutSchema } from "@/lib/validators/checkout";
import type { PaymentMethod } from "@prisma/client";
import { NextResponse } from "next/server";

const CHECKOUT_CONFLICT = "CHECKOUT_CONFLICT";

function createOrderNumber() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replaceAll("-", "");
  return `ORD-${date}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

export async function POST(request: Request) {
  const authorization = await requireApiPermission("orders:create");
  if (authorization.error) return authorization.error;

  const input = checkoutSchema.safeParse(await request.json());
  if (!input.success) {
    return NextResponse.json({ error: "Invalid checkout", details: input.error.flatten() }, { status: 400 });
  }

  const quantities = new Map<string, number>();
  for (const item of input.data.items) {
    quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
  }

  try {
    const receipt = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: { id: { in: [...quantities.keys()] }, isActive: true },
      });
      if (products.length !== quantities.size) {
        throw new Error(`${CHECKOUT_CONFLICT}: Product not found`);
      }

      const billing = calculateBilling(
        products.map((product) => ({
          productId: product.id,
          name: product.name,
          quantity: quantities.get(product.id) ?? 0,
          unitPrice: Number(product.price),
          taxRate: Number(product.taxRate),
        })),
        input.data.discountPercent,
      );
      const paymentTotal = input.data.payments.reduce((total, payment) => total + toCents(payment.amount), 0);
      if (paymentTotal !== toCents(billing.totalAmount)) {
        throw new Error(`${CHECKOUT_CONFLICT}: Payment total must equal order total`);
      }
      if (input.data.payments.some((payment) => payment.method === "UPI" && !payment.reference)) {
        throw new Error(`${CHECKOUT_CONFLICT}: UPI reference is required`);
      }

      for (const line of billing.lines) {
        const update = await tx.product.updateMany({
          where: { id: line.productId, isActive: true, stockQuantity: { gte: line.quantity } },
          data: { stockQuantity: { decrement: line.quantity } },
        });
        if (update.count !== 1) {
          throw new Error(`${CHECKOUT_CONFLICT}: Insufficient stock for ${line.name}`);
        }
      }

      const methods = [...new Set(input.data.payments.map((payment) => payment.method))];
      const paymentMethod: PaymentMethod = methods.length === 1 ? methods[0] : "SPLIT";
      const order = await tx.order.create({
        data: {
          orderNumber: createOrderNumber(),
          cashierId: authorization.session.user.id,
          subtotal: billing.subtotal,
          taxAmount: billing.taxAmount,
          discountAmount: billing.discountAmount,
          totalAmount: billing.totalAmount,
          paymentMethod,
          status: "COMPLETED",
          notes: input.data.notes,
          items: {
            create: billing.lines.map((line) => ({
              productId: line.productId,
              quantity: line.quantity,
              unitPrice: line.unitPrice,
              taxRate: line.taxRate,
              taxAmount: line.taxAmount,
              discount: line.discountAmount,
              subtotal: line.subtotal,
            })),
          },
          payments: {
            create: input.data.payments,
          },
        },
        include: orderReceiptInclude,
      });

      await tx.inventoryTransaction.createMany({
        data: billing.lines.map((line) => ({
          productId: line.productId,
          transactionType: "OUT",
          quantity: -line.quantity,
          reason: "Sale",
          referenceId: order.id,
        })),
      });
      await tx.auditLog.create({
        data: {
          userId: authorization.session.user.id,
          action: "CREATE_ORDER",
          entity: "Order",
          entityId: order.id,
          details: JSON.stringify({ orderNumber: order.orderNumber, totalAmount: billing.totalAmount }),
        },
      });
      return serializeReceipt(order);
    }, { isolationLevel: "Serializable" });

    return NextResponse.json({ receipt }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith(CHECKOUT_CONFLICT)) {
      return NextResponse.json({ error: error.message.slice(CHECKOUT_CONFLICT.length + 2) }, { status: 409 });
    }
    throw error;
  }
}

