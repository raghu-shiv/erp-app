import { StockInwardForm } from "@/components/purchases/StockInwardForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { DataTable } from "@/components/ui/Table";
import { formatDateTime } from "@/lib/dates";
import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Purchases" };

export default async function PurchasesPage() {
  await requirePermission("purchases:view");

  const [products, suppliers, recentInward] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      select: { id: true, name: true, sku: true, barcode: true, stockQuantity: true },
      orderBy: { name: "asc" },
    }),
    prisma.supplier.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.inventoryTransaction.findMany({
      where: { transactionType: "IN" },
      include: { product: { select: { name: true, sku: true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="Purchases" description="Receive inward stock by scan or manual upload." />
      <Panel className="p-5">
        <h2 className="mb-4 font-semibold">Stock inward</h2>
        <StockInwardForm products={products} suppliers={suppliers} />
      </Panel>
      <div>
        <h2 className="mb-3 font-semibold">Recent inward transactions</h2>
        <DataTable headings={["Date", "Product", "SKU", "Quantity", "Reference", "Reason"]}>
          {recentInward.map((transaction) => (
            <tr key={transaction.id}>
              <td className="px-5 py-4 text-sm text-slate-500">{formatDateTime(transaction.createdAt)}</td>
              <td className="px-5 py-4 text-sm font-medium">{transaction.product.name}</td>
              <td className="px-5 py-4 text-sm text-slate-500">{transaction.product.sku}</td>
              <td className="px-5 py-4 text-sm text-emerald-700">+{transaction.quantity}</td>
              <td className="px-5 py-4 text-sm text-slate-500">{transaction.referenceId ?? "-"}</td>
              <td className="px-5 py-4 text-sm text-slate-500">{transaction.reason ?? "-"}</td>
            </tr>
          ))}
        </DataTable>
      </div>
    </div>
  );
}
