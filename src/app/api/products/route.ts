import { requireApiPermission } from "@/lib/api-auth";
import { prisma } from "@/lib/db";
import { productInputSchema } from "@/lib/validators/product";
import { NextResponse } from "next/server";

export async function GET() {
  const authorization = await requireApiPermission("products:view");
  if (authorization.error) return authorization.error;

  const products = await prisma.product.findMany({
    include: {
      category: true,
      supplier: true,
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const authorization = await requireApiPermission("products:create");
  if (authorization.error) return authorization.error;

  const input = productInputSchema.safeParse(await request.json());
  if (!input.success) {
    return NextResponse.json({ error: "Invalid product", details: input.error.flatten() }, { status: 400 });
  }

  const product = await prisma.$transaction(async (tx) => {
    const createdProduct = await tx.product.create({ data: input.data });
    await tx.auditLog.create({
      data: {
        userId: authorization.session.user.id,
        action: "CREATE_PRODUCT",
        entity: "Product",
        entityId: createdProduct.id,
      },
    });
    return createdProduct;
  });

  return NextResponse.json({ product }, { status: 201 });
}

