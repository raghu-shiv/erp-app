"use client";

import { useCart } from "@/contexts/cart-context";
import { formatCurrency } from "@/lib/billing";
import Link from "next/link";

export function ReceiptBanner() {
  const { receipt } = useCart();
  if (!receipt) return null;
  return <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/30"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Payment completed</p><h2 className="text-lg font-bold text-slate-800 dark:text-white">{receipt.orderNumber}</h2><p className="text-sm text-slate-500">{formatCurrency(receipt.totalAmount)} via {receipt.paymentMethod}</p></div><Link href={`/orders/${receipt.id}`} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white">View receipt</Link></div></section>;
}

