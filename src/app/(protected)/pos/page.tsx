import { PosTerminal } from "@/components/pos/PosTerminal";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "POS Terminal" };

export default async function PosPage() {
  await requirePermission("orders:create");
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { name: "asc" },
  });

  return (
    <PosTerminal
      products={products.map((product) => ({
        id: product.id,
        name: product.name,
        sku: product.sku,
        barcode: product.barcode,
        price: Number(product.price),
        taxRate: Number(product.taxRate),
        stockQuantity: product.stockQuantity,
        unit: product.unit,
        category: product.category?.name ?? "Uncategorized",
      }))}
    />
  );
}
