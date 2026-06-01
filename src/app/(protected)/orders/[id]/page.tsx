import { PrintReceiptButton } from "@/components/orders/PrintReceiptButton";
import { formatCurrency } from "@/lib/billing";
import { prisma } from "@/lib/db";
import { orderReceiptInclude } from "@/lib/orders";
import { requirePermission } from "@/lib/rbac";
import { notFound } from "next/navigation";

export default async function OrderReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("orders:view");
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: orderReceiptInclude });
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm print:border-0 print:shadow-none dark:border-slate-700 dark:bg-slate-800">
      <div className="flex justify-between gap-4 border-b border-slate-200 pb-5"><div><p className="text-sm font-semibold text-indigo-600">ERP POS SYSTEM</p><h1 className="text-2xl font-bold">Sales Receipt</h1><p className="mt-1 text-sm text-slate-500">{order.orderNumber}</p></div><PrintReceiptButton /></div>
      <div className="grid grid-cols-2 gap-4 py-5 text-sm"><div><p className="text-slate-500">Date</p><p>{order.createdAt.toLocaleString("en-IN")}</p></div><div><p className="text-slate-500">Cashier</p><p>{order.cashier.name}</p></div></div>
      <table className="w-full border-y border-slate-200 text-sm"><thead><tr className="text-left text-xs uppercase text-slate-500"><th className="py-3">Item</th><th>Qty</th><th>Price</th><th>GST</th><th className="text-right">Subtotal</th></tr></thead>
        <tbody>{order.items.map((item) => <tr key={item.id} className="border-t border-slate-100"><td className="py-3"><p className="font-medium">{item.product.name}</p><p className="text-xs text-slate-500">{item.product.sku}</p></td><td>{item.quantity}</td><td>{formatCurrency(Number(item.unitPrice))}</td><td>{Number(item.taxRate)}%</td><td className="text-right">{formatCurrency(Number(item.subtotal) + Number(item.taxAmount))}</td></tr>)}</tbody>
      </table>
      <div className="ml-auto mt-5 max-w-xs space-y-2 text-sm"><p className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(Number(order.subtotal))}</span></p><p className="flex justify-between"><span>Discount</span><span>- {formatCurrency(Number(order.discountAmount))}</span></p><p className="flex justify-between"><span>GST</span><span>{formatCurrency(Number(order.taxAmount))}</span></p><p className="flex justify-between border-t border-slate-200 pt-2 text-lg font-bold"><span>Total</span><span>{formatCurrency(Number(order.totalAmount))}</span></p></div>
      <div className="mt-6 border-t border-slate-200 pt-4 text-sm"><p className="font-semibold">Payments</p>{order.payments.map((payment) => <p key={payment.id} className="mt-1 text-slate-500">{payment.method}: {formatCurrency(Number(payment.amount))}{payment.reference ? ` (${payment.reference})` : ""}</p>)}</div>
    </div>
  );
}

