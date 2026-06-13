import { requireApiPermission } from "@/lib/api-auth";
import { prisma } from "@/lib/db";
import { stockInwardSchema } from "@/lib/validators/product";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const authorization = await requireApiPermission("purchases:create");
  if (authorization.error) return authorization.error;

  const input = stockInwardSchema.safeParse(await request.json());
  if (!input.success) {
    return NextResponse.json({ error: "Invalid stock inward payload", details: input.error.flatten() }, { status: 400 });
  }

  const duplicate = input.data.lines.find((line, index, lines) =>
    lines.findIndex((candidate) => candidate.lookup.toLowerCase() === line.lookup.toLowerCase()) !== index,
  );
  if (duplicate) {
    return NextResponse.json({ error: `Duplicate stock inward line for ${duplicate.lookup}` }, { status: 400 });
  }

  const lookups = input.data.lines.map((line) => line.lookup);
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { id: { in: lookups } },
        { sku: { in: lookups } },
        { barcode: { in: lookups } },
      ],
    },
    select: { id: true, name: true, sku: true, barcode: true },
  });

  const productByLookup = new Map<string, (typeof products)[number]>();
  for (const product of products) {
    productByLookup.set(product.id.toLowerCase(), product);
    productByLookup.set(product.sku.toLowerCase(), product);
    if (product.barcode) productByLookup.set(product.barcode.toLowerCase(), product);
  }

  const missing = input.data.lines
    .map((line) => line.lookup)
    .filter((lookup) => !productByLookup.has(lookup.toLowerCase()));
  if (missing.length > 0) {
    return NextResponse.json({ error: `Unknown product lookup: ${missing.join(", ")}` }, { status: 404 });
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedProducts = [];
    for (const line of input.data.lines) {
      const product = productByLookup.get(line.lookup.toLowerCase());
      if (!product) throw new Error(`Unknown product lookup: ${line.lookup}`);

      const updated = await tx.product.update({
        where: { id: product.id },
        data: { stockQuantity: { increment: line.quantity } },
        select: { id: true, name: true, sku: true, stockQuantity: true },
      });

      await tx.inventoryTransaction.create({
        data: {
          productId: product.id,
          transactionType: "IN",
          quantity: line.quantity,
          reason: input.data.reason,
          referenceId: input.data.referenceId,
        },
      });

      updatedProducts.push(updated);
    }

    await tx.auditLog.create({
      data: {
        userId: authorization.session.user.id,
        action: "STOCK_INWARD",
        entity: "InventoryTransaction",
        entityId: input.data.referenceId ?? "manual-stock-inward",
        details: JSON.stringify({
          referenceId: input.data.referenceId,
          supplierId: input.data.supplierId,
          lineCount: input.data.lines.length,
          totalQuantity: input.data.lines.reduce((total, line) => total + line.quantity, 0),
        }),
      },
    });

    return updatedProducts;
  });

  revalidatePath("/dashboard");
  revalidatePath("/inventory");
  revalidatePath("/purchases");
  revalidatePath("/reports");

  return NextResponse.json({ products: result });
}
