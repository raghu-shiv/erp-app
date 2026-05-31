import { requireApiPermission } from "@/lib/api-auth";
import { prisma } from "@/lib/db";
import { productUpdateSchema } from "@/lib/validators/product";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const authorization = await requireApiPermission("products:view");
  if (authorization.error) return authorization.error;

  const { id } = await context.params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      supplier: true,
      inventoryTxns: {
        orderBy: { createdAt: "desc" },
        take: 25,
      },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ product });
}

export async function PUT(request: Request, context: RouteContext) {
  const authorization = await requireApiPermission("products:update");
  if (authorization.error) return authorization.error;

  const input = productUpdateSchema.safeParse(await request.json());
  if (!input.success) {
    return NextResponse.json({ error: "Invalid product", details: input.error.flatten() }, { status: 400 });
  }

  const { id } = await context.params;
  const product = await prisma.$transaction(async (tx) => {
    const updatedProduct = await tx.product.update({
      where: { id },
      data: input.data,
    });
    await tx.auditLog.create({
      data: {
        userId: authorization.session.user.id,
        action: "UPDATE_PRODUCT",
        entity: "Product",
        entityId: updatedProduct.id,
        details: JSON.stringify(input.data),
      },
    });
    return updatedProduct;
  });

  return NextResponse.json({ product });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const authorization = await requireApiPermission("products:delete");
  if (authorization.error) return authorization.error;

  const { id } = await context.params;
  const product = await prisma.$transaction(async (tx) => {
    const archivedProduct = await tx.product.update({
      where: { id },
      data: { isActive: false },
    });
    await tx.auditLog.create({
      data: {
        userId: authorization.session.user.id,
        action: "ARCHIVE_PRODUCT",
        entity: "Product",
        entityId: archivedProduct.id,
      },
    });
    return archivedProduct;
  });

  return NextResponse.json({ product });
}

