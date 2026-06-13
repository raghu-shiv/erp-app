"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCart, type ReceiptSummary } from "@/contexts/cart-context";
import { formatCurrency } from "@/lib/billing";
import { useState } from "react";

export function CartPanel({ onError }: { onError: (message: string) => void }) {
  const cart = useCart();
  const [loading, setLoading] = useState(false);

  async function checkout() {
    if (cart.items.length === 0) return;
    if (cart.paymentMethod === "UPI" && !cart.paymentReference.trim()) {
      onError("Enter the UPI transaction reference.");
      return;
    }
    setLoading(true);
    onError("");
    try {
      const response = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.items.map((item) => ({ productId: item.id, quantity: item.quantity })),
          discountPercent: cart.discountPercent,
          payments: [{ method: cart.paymentMethod, amount: cart.billing.totalAmount, reference: cart.paymentMethod === "UPI" ? cart.paymentReference : undefined }],
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Checkout failed");
      cart.completeCheckout(body.receipt as ReceiptSummary);
    } catch (error) {
      onError(error instanceof Error ? error.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return <aside className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Current Cart</h2>
    <div className="my-4 space-y-3">
      {cart.items.length === 0 && <p className="text-sm text-slate-500">Scan or select products to begin.</p>}
      {cart.items.map((item) => <div key={item.id} className="rounded-lg border border-slate-100 p-3 dark:border-slate-700">
        <div className="flex justify-between gap-3"><div><p className="text-sm font-medium">{item.name}</p><p className="text-xs text-slate-500">{formatCurrency(item.price)}</p></div><Button variant="danger" className="px-2 py-1 text-xs" onClick={() => cart.setQuantity(item, 0)}>Remove</Button></div>
        <div className="mt-3 flex items-center gap-2"><Button variant="muted" className="h-7 w-7 p-0" onClick={() => cart.setQuantity(item, item.quantity - 1)}>-</Button><span className="w-8 text-center text-sm">{item.quantity}</span><Button variant="muted" className="h-7 w-7 p-0" onClick={() => {
          if (!cart.setQuantity(item, item.quantity + 1)) onError(`Only ${item.stockQuantity} ${item.unit} available for ${item.name}.`);
        }}>+</Button></div>
      </div>)}
    </div>
    <label className="text-xs font-semibold uppercase text-slate-500">Discount percent</label>
    <Input type="number" min="0" max="100" value={cart.discountPercent} onChange={(event) => cart.setDiscountPercent(Math.min(100, Math.max(0, Number(event.target.value))))} className="mb-4 mt-1" />
    <div className="space-y-2 border-t border-slate-200 pt-4 text-sm">
      <p className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(cart.billing.subtotal)}</span></p>
      <p className="flex justify-between"><span>Discount</span><span>- {formatCurrency(cart.billing.discountAmount)}</span></p>
      <p className="flex justify-between"><span>GST</span><span>{formatCurrency(cart.billing.taxAmount)}</span></p>
      <p className="flex justify-between text-lg font-bold"><span>Total</span><span>{formatCurrency(cart.billing.totalAmount)}</span></p>
    </div>
    <div className="mt-5 grid grid-cols-2 gap-2">{(["CASH", "UPI"] as const).map((method) => <Button key={method} variant={cart.paymentMethod === method ? "primary" : "muted"} onClick={() => cart.setPaymentMethod(method)}>{method}</Button>)}</div>
    {cart.paymentMethod === "UPI" && <Input value={cart.paymentReference} onChange={(event) => cart.setPaymentReference(event.target.value)} placeholder="UPI transaction reference" className="mt-3" />}
    <Button variant="success" onClick={checkout} disabled={loading || cart.items.length === 0} className="mt-4 w-full py-3 text-base">{loading ? "Processing..." : `Pay ${formatCurrency(cart.billing.totalAmount)}`}</Button>
  </aside>;
}

