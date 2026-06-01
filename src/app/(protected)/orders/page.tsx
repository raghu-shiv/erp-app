import { formatCurrency } from "@/lib/billing";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";
import Link from "next/link";

export default async function OrdersPage() {
  await requirePermission("orders:view");
  const orders = await prisma.order.findMany({
    include: { cashier: { select: { name: true } }, _count: { select: { items: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-slate-800 dark:text-white">Orders</h1><p className="mt-1 text-sm text-slate-500">Recent completed sales and receipts.</p></div>
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-900/40"><tr>{["Order", "Date", "Cashier", "Items", "Payment", "Status", "Total"].map((heading) => <th key={heading} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{heading}</th>)}</tr></thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">{orders.map((order) => <tr key={order.id}>
            <td className="px-5 py-4 text-sm font-medium"><Link className="text-indigo-600 hover:underline" href={`/orders/${order.id}`}>{order.orderNumber}</Link></td>
            <td className="px-5 py-4 text-sm text-slate-500">{order.createdAt.toLocaleString("en-IN")}</td><td className="px-5 py-4 text-sm text-slate-500">{order.cashier.name}</td>
            <td className="px-5 py-4 text-sm text-slate-500">{order._count.items}</td><td className="px-5 py-4 text-sm text-slate-500">{order.paymentMethod}</td>
            <td className="px-5 py-4 text-sm text-slate-500">{order.status}</td><td className="px-5 py-4 text-sm font-semibold">{formatCurrency(Number(order.totalAmount))}</td>
          </tr>)}</tbody>
        </table></div>
      </section>
    </div>
  );
}
