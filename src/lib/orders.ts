import type { Prisma } from "@prisma/client";

export const orderReceiptInclude = {
  cashier: { select: { name: true } },
  items: {
    include: {
      product: { select: { name: true, sku: true } },
    },
  },
  payments: true,
} satisfies Prisma.OrderInclude;

export type OrderReceipt = Prisma.OrderGetPayload<{
  include: typeof orderReceiptInclude;
}>;

export function serializeReceipt(order: OrderReceipt) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    createdAt: order.createdAt.toISOString(),
    cashierName: order.cashier.name,
    subtotal: Number(order.subtotal),
    taxAmount: Number(order.taxAmount),
    discountAmount: Number(order.discountAmount),
    totalAmount: Number(order.totalAmount),
    paymentMethod: order.paymentMethod,
    notes: order.notes,
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      sku: item.product.sku,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      taxRate: Number(item.taxRate),
      taxAmount: Number(item.taxAmount),
      discountAmount: Number(item.discount),
      subtotal: Number(item.subtotal),
    })),
    payments: order.payments.map((payment) => ({
      id: payment.id,
      method: payment.method,
      amount: Number(payment.amount),
      reference: payment.reference,
    })),
  };
}

