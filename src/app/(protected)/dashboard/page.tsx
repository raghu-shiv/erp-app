import { MetricCard } from "@/components/ui/MetricCard";
import { Panel } from "@/components/ui/Panel";
import { formatCurrency } from "@/lib/billing";
import { startOfToday } from "@/lib/dates";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await requirePermission("dashboard:view");
  const [sales, activeProducts, stockProducts, recentOrders] = await Promise.all([
    prisma.order.aggregate({ where: { status: "COMPLETED", createdAt: { gte: startOfToday() } }, _sum: { totalAmount: true }, _count: true }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.findMany({ where: { isActive: true }, select: { id: true, name: true, stockQuantity: true, minStockAlert: true } }),
    prisma.order.findMany({ where: { status: "COMPLETED" }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);
  const lowStock = stockProducts.filter((product) => product.stockQuantity <= product.minStockAlert);
  const metrics = [["Today's Sales", formatCurrency(Number(sales._sum.totalAmount ?? 0))], ["Orders", String(sales._count)], ["Products", String(activeProducts)], ["Low Stock", String(lowStock.length)]];
  return <div className="space-y-6">
    <div className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white shadow-lg shadow-indigo-500/20"><h1 className="text-2xl font-bold">Welcome back, {session.user.name}</h1><p className="mt-1 text-indigo-100">Here&apos;s your business overview for today.</p></div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">{metrics.map(([label, value]) => <MetricCard key={label} label={label} value={value} eyebrow="Live" />)}</div>
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Panel className="p-6"><h2 className="mb-4 font-semibold">Recent Orders</h2>{recentOrders.length === 0 ? <p className="text-sm text-slate-500">No orders yet. Start selling from the POS terminal.</p> : recentOrders.map((order) => <Link key={order.id} href={`/orders/${order.id}`} className="flex justify-between border-t border-slate-100 py-2 text-sm first:border-0"><span>{order.orderNumber}</span><span className="font-semibold">{formatCurrency(Number(order.totalAmount))}</span></Link>)}</Panel>
      <Panel className="p-6"><h2 className="mb-4 font-semibold">Inventory Alerts</h2>{lowStock.length === 0 ? <p className="text-sm text-slate-500">No alerts. All stock levels are healthy.</p> : lowStock.slice(0, 5).map((product) => <p key={product.id} className="flex justify-between border-t border-slate-100 py-2 text-sm first:border-0"><span>{product.name}</span><span className="font-semibold text-amber-600">{product.stockQuantity} left</span></p>)}</Panel>
    </div>
  </div>;
}

