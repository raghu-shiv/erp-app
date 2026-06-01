import { formatCurrency } from "@/lib/billing";
import { startOfToday } from "@/lib/dates";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";

export default async function ReportsPage() {
  await requirePermission("reports:view");
  const [sales, products] = await Promise.all([
    prisma.order.aggregate({ where: { status: "COMPLETED", createdAt: { gte: startOfToday() } }, _sum: { totalAmount: true, taxAmount: true }, _count: true }),
    prisma.product.findMany({ where: { isActive: true }, include: { category: true }, orderBy: { name: "asc" } }),
  ]);
  const inventoryValue = products.reduce((total, product) => total + Number(product.price) * product.stockQuantity, 0);
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Reports</h1><p className="mt-1 text-sm text-slate-500">Daily sales and current inventory summary.</p></div>
      <div className="grid gap-4 md:grid-cols-4">{[["Today's sales", formatCurrency(Number(sales._sum.totalAmount ?? 0))], ["Orders", String(sales._count)], ["GST collected", formatCurrency(Number(sales._sum.taxAmount ?? 0))], ["Inventory value", formatCurrency(inventoryValue)]].map(([label, value]) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-xl font-bold">{value}</p></div>)}</div>
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"><div className="border-b border-slate-200 px-5 py-4"><h2 className="font-semibold">Current inventory report</h2></div><div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-200">
        <thead><tr>{["Product", "SKU", "Category", "Stock", "Minimum", "Retail Value"].map((heading) => <th key={heading} className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{products.map((product) => <tr key={product.id}><td className="px-5 py-3 text-sm font-medium">{product.name}</td><td className="px-5 py-3 text-sm text-slate-500">{product.sku}</td><td className="px-5 py-3 text-sm text-slate-500">{product.category?.name ?? "Uncategorized"}</td><td className="px-5 py-3 text-sm">{product.stockQuantity}</td><td className="px-5 py-3 text-sm">{product.minStockAlert}</td><td className="px-5 py-3 text-sm">{formatCurrency(Number(product.price) * product.stockQuantity)}</td></tr>)}</tbody>
      </table></div></section>
    </div>
  );
}

