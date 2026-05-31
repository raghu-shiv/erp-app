import { requireApiPermission } from "@/lib/api-auth";
import { prisma } from "@/lib/db";
import { stockAdjustmentSchema } from "@/lib/validators/product";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const authorization = await requireApiPermission("inventory:update");
  if (authorization.error) return authorization.error;

  const input = stockAdjustmentSchema.safeParse(await request.json());
  if (!input.success) {
    return NextResponse.json({ error: "Invalid stock adjustment", details: input.error.flatten() }, { status: 400 });
  }

  const { id } = await context.params;
  const signedQuantity =
    input.data.transactionType === "OUT" ? -Math.abs(input.data.quantity) : input.data.quantity;

  try {
    const product = await prisma.$transaction(async (tx) => {
      const updated = await tx.product.updateMany({
        where: {
          id,
          stockQuantity: signedQuantity < 0 ? { gte: Math.abs(signedQuantity) } : undefined,
        },
        data: {
          stockQuantity: { increment: signedQuantity },
        },
      });

      if (updated.count !== 1) {
        throw new Error("INSUFFICIENT_STOCK_OR_PRODUCT_NOT_FOUND");
      }

      const updatedProduct = await tx.product.findUniqueOrThrow({ where: { id } });
      await tx.inventoryTransaction.create({
        data: {
          productId: id,
          transactionType: input.data.transactionType,
          quantity: signedQuantity,
          reason: input.data.reason,
          referenceId: input.data.referenceId,
        },
      });
      await tx.auditLog.create({
        data: {
          userId: authorization.session.user.id,
          action: "UPDATE_STOCK",
          entity: "Product",
          entityId: id,
          details: JSON.stringify({ ...input.data, quantity: signedQuantity }),
        },
      });
      return updatedProduct;
    });

    return NextResponse.json({ product });
  } catch (error) {
    if (error instanceof Error && error.message === "INSUFFICIENT_STOCK_OR_PRODUCT_NOT_FOUND") {
      return NextResponse.json({ error: "Product not found or insufficient stock" }, { status: 409 });
    }
    throw error;
  }
}

