import { LowStockAlerts } from "@/components/inventory/LowStockAlerts";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";

export default async function InventoryPage() {
  await requirePermission("inventory:view");

  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { name: "asc" },
  });
  const lowStockProducts = products.filter((product) => product.stockQuantity <= product.minStockAlert);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Inventory</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Track active products and stock levels.
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
        <h2 className="mb-4 font-semibold text-slate-800 dark:text-white">Low Stock Alerts</h2>
        <LowStockAlerts products={lowStockProducts} />
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-900/40">
              <tr>
                {["Product", "SKU", "Category", "Unit Price", "Stock", "Minimum"].map((heading) => (
                  <th key={heading} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-5 py-4 text-sm font-medium text-slate-800 dark:text-white">{product.name}</td>
                  <td className="px-5 py-4 text-sm text-slate-500">{product.sku}</td>
                  <td className="px-5 py-4 text-sm text-slate-500">{product.category?.name ?? "Uncategorized"}</td>
                  <td className="px-5 py-4 text-sm text-slate-500">INR {product.price.toFixed(2)}</td>
                  <td className="px-5 py-4 text-sm text-slate-500">{product.stockQuantity}</td>
                  <td className="px-5 py-4 text-sm text-slate-500">{product.minStockAlert}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

