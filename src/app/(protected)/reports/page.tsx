import { MetricCard } from "@/components/ui/MetricCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/Table";
import { formatCurrency } from "@/lib/billing";
import { startOfToday } from "@/lib/dates";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Reports" };

export default async function ReportsPage() {
  await requirePermission("reports:view");
  const [sales, products] = await Promise.all([
    prisma.order.aggregate({ where: { status: "COMPLETED", createdAt: { gte: startOfToday() } }, _sum: { totalAmount: true, taxAmount: true }, _count: true }),
    prisma.product.findMany({ where: { isActive: true }, include: { category: true }, orderBy: { name: "asc" } }),
  ]);
  const inventoryValue = products.reduce((total, product) => total + Number(product.price) * product.stockQuantity, 0);
  const metrics = [["Today's sales", formatCurrency(Number(sales._sum.totalAmount ?? 0))], ["Orders", String(sales._count)], ["GST collected", formatCurrency(Number(sales._sum.taxAmount ?? 0))], ["Inventory value", formatCurrency(inventoryValue)]];
  return <div className="space-y-6">
    <PageHeader title="Reports" description="Daily sales and current inventory summary." />
    <div className="grid gap-4 md:grid-cols-4">{metrics.map(([label, value]) => <MetricCard key={label} label={label} value={value} />)}</div>
    <div><h2 className="mb-3 font-semibold">Current inventory report</h2><DataTable headings={["Product", "SKU", "Category", "Stock", "Minimum", "Retail Value"]}>{products.map((product) => <tr key={product.id}><td className="px-5 py-3 text-sm font-medium">{product.name}</td><td className="px-5 py-3 text-sm text-slate-500">{product.sku}</td><td className="px-5 py-3 text-sm text-slate-500">{product.category?.name ?? "Uncategorized"}</td><td className="px-5 py-3 text-sm">{product.stockQuantity}</td><td className="px-5 py-3 text-sm">{product.minStockAlert}</td><td className="px-5 py-3 text-sm">{formatCurrency(Number(product.price) * product.stockQuantity)}</td></tr>)}</DataTable></div>
  </div>;
}

