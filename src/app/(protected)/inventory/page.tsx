import { LowStockAlerts } from "@/components/inventory/LowStockAlerts";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { DataTable } from "@/components/ui/Table";
import { formatCurrency } from "@/lib/billing";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Inventory" };

export default async function InventoryPage() {
  await requirePermission("inventory:view");
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { name: "asc" },
  });
  const lowStockProducts = products.filter(
    (product) => product.stockQuantity <= product.minStockAlert,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        description="Track active products and stock levels."
      />
      <Panel className="p-5">
        <h2 className="mb-4 font-semibold">Low Stock Alerts</h2>
        <LowStockAlerts products={lowStockProducts} />
      </Panel>
      <DataTable
        headings={[
          "Product",
          "SKU",
          "Category",
          "Unit Price",
          "Stock",
          "Minimum",
        ]}
      >
        {products.map((product) => (
          <tr key={product.id}>
            <td className="px-5 py-4 text-sm font-medium">{product.name}</td>
            <td className="px-5 py-4 text-sm text-slate-500">{product.sku}</td>
            <td className="px-5 py-4 text-sm text-slate-500">
              {product.category?.name ?? "Uncategorized"}
            </td>
            <td className="px-5 py-4 text-sm text-slate-500">
              {formatCurrency(Number(product.price))}
            </td>
            <td className="px-5 py-4 text-sm text-slate-500">
              {product.stockQuantity}
            </td>
            <td className="px-5 py-4 text-sm text-slate-500">
              {product.minStockAlert}
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
