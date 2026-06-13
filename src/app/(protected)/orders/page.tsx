import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/Table";
import { formatCurrency } from "@/lib/billing";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Orders" };

export default async function OrdersPage() {
  await requirePermission("orders:view");
  const orders = await prisma.order.findMany({ include: { cashier: { select: { name: true } }, _count: { select: { items: true } } }, orderBy: { createdAt: "desc" }, take: 100 });
  return <div className="space-y-6">
    <PageHeader title="Orders" description="Recent completed sales and receipts." />
    <DataTable headings={["Order", "Date", "Cashier", "Items", "Payment", "Status", "Total"]}>
      {orders.map((order) => <tr key={order.id}><td className="px-5 py-4 text-sm font-medium"><Link className="text-indigo-600 hover:underline" href={`/orders/${order.id}`}>{order.orderNumber}</Link></td><td className="px-5 py-4 text-sm text-slate-500">{order.createdAt.toLocaleString("en-IN")}</td><td className="px-5 py-4 text-sm text-slate-500">{order.cashier.name}</td><td className="px-5 py-4 text-sm text-slate-500">{order._count.items}</td><td className="px-5 py-4 text-sm text-slate-500">{order.paymentMethod}</td><td className="px-5 py-4 text-sm text-slate-500">{order.status}</td><td className="px-5 py-4 text-sm font-semibold">{formatCurrency(Number(order.totalAmount))}</td></tr>)}
    </DataTable>
  </div>;
}

