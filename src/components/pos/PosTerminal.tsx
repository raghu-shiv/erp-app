"use client";

import { calculateBilling, formatCurrency } from "@/lib/billing";
import { useMemo, useState, type FormEvent, type KeyboardEvent } from "react";
import Link from "next/link";

type PosProduct = {
  id: string;
  name: string;
  sku: string;
  barcode: string | null;
  price: number;
  taxRate: number;
  stockQuantity: number;
  unit: string;
  category: string;
};

type CartItem = PosProduct & { quantity: number };

type Receipt = {
  id: string;
  orderNumber: string;
  createdAt: string;
  cashierName: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: string;
};

export function PosTerminal({ products }: { products: PosProduct[] }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [barcode, setBarcode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "UPI">("CASH");
  const [paymentReference, setPaymentReference] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  const billing = useMemo(
    () => calculateBilling(cart.map((item) => ({
      productId: item.id,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.price,
      taxRate: item.taxRate,
    })), discountPercent),
    [cart, discountPercent],
  );
  const visibleProducts = products.filter((product) =>
    `${product.name} ${product.sku} ${product.barcode ?? ""}`.toLowerCase().includes(search.toLowerCase()),
  );

  function addProduct(product: PosProduct) {
    setError("");
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      const nextQuantity = (existing?.quantity ?? 0) + 1;
      if (nextQuantity > product.stockQuantity) {
        setError(`Only ${product.stockQuantity} ${product.unit} available for ${product.name}.`);
        return current;
      }
      return existing
        ? current.map((item) => item.id === product.id ? { ...item, quantity: nextQuantity } : item)
        : [...current, { ...product, quantity: 1 }];
    });
  }

  function updateQuantity(productId: string, quantity: number) {
    const product = products.find((item) => item.id === productId);
    if (!product) return;
    if (quantity <= 0) {
      setCart((current) => current.filter((item) => item.id !== productId));
      return;
    }
    if (quantity > product.stockQuantity) {
      setError(`Only ${product.stockQuantity} ${product.unit} available for ${product.name}.`);
      return;
    }
    setError("");
    setCart((current) => current.map((item) => item.id === productId ? { ...item, quantity } : item));
  }

  function addScannedProduct() {
    const product = products.find((item) => item.barcode === barcode.trim() || item.sku === barcode.trim());
    if (!product) {
      setError("No active product matches that barcode or SKU.");
    } else {
      addProduct(product);
      setBarcode("");
    }
  }

  function scanBarcode(event: FormEvent) {
    event.preventDefault();
    addScannedProduct();
  }

  function handleScannerKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      addScannedProduct();
    }
  }

  async function checkout() {
    if (cart.length === 0) return;
    if (paymentMethod === "UPI" && !paymentReference.trim()) {
      setError("Enter the UPI transaction reference.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({ productId: item.id, quantity: item.quantity })),
          discountPercent,
          payments: [{
            method: paymentMethod,
            amount: billing.totalAmount,
            reference: paymentMethod === "UPI" ? paymentReference : undefined,
          }],
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Checkout failed");
      setReceipt(body.receipt);
      setCart([]);
      setDiscountPercent(0);
      setPaymentReference("");
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {receipt && (
        <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/30">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Payment completed</p>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">{receipt.orderNumber}</h2>
              <p className="text-sm text-slate-500">{formatCurrency(receipt.totalAmount)} via {receipt.paymentMethod}</p>
            </div>
            <Link href={`/orders/${receipt.id}`} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white">
              View receipt
            </Link>
          </div>
        </section>
      )}

      {error && <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <section className="space-y-4">
          <form onSubmit={scanBarcode} className="flex gap-2">
            <input value={barcode} onChange={(event) => setBarcode(event.target.value)} onKeyDown={handleScannerKeyDown} autoFocus
              placeholder="Scan barcode or enter SKU" className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm" />
            <button className="rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white">Add</button>
          </form>
          <input value={search} onChange={(event) => setSearch(event.target.value)}
            placeholder="Search product catalog" className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProducts.map((product) => (
              <button key={product.id} onClick={() => addProduct(product)} disabled={product.stockQuantity === 0}
                className="rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-indigo-300 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800">
                <p className="font-semibold text-slate-800 dark:text-white">{product.name}</p>
                <p className="mt-1 text-xs text-slate-500">{product.sku} | {product.category}</p>
                <div className="mt-3 flex justify-between text-sm">
                  <span className="font-semibold text-indigo-600">{formatCurrency(product.price)}</span>
                  <span className="text-slate-500">{product.stockQuantity} {product.unit}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <aside className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Current Cart</h2>
          <div className="my-4 space-y-3">
            {cart.length === 0 && <p className="text-sm text-slate-500">Scan or select products to begin.</p>}
            {cart.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-100 p-3 dark:border-slate-700">
                <div className="flex justify-between gap-3">
                  <div><p className="text-sm font-medium">{item.name}</p><p className="text-xs text-slate-500">{formatCurrency(item.price)}</p></div>
                  <button onClick={() => updateQuantity(item.id, 0)} className="text-xs font-medium text-red-600">Remove</button>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="h-7 w-7 rounded bg-slate-100">-</button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-7 w-7 rounded bg-slate-100">+</button>
                </div>
              </div>
            ))}
          </div>
          <label className="text-xs font-semibold uppercase text-slate-500">Discount percent</label>
          <input type="number" min="0" max="100" value={discountPercent}
            onChange={(event) => setDiscountPercent(Math.min(100, Math.max(0, Number(event.target.value))))}
            className="mb-4 mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <div className="space-y-2 border-t border-slate-200 pt-4 text-sm">
            <p className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(billing.subtotal)}</span></p>
            <p className="flex justify-between"><span>Discount</span><span>- {formatCurrency(billing.discountAmount)}</span></p>
            <p className="flex justify-between"><span>GST</span><span>{formatCurrency(billing.taxAmount)}</span></p>
            <p className="flex justify-between text-lg font-bold"><span>Total</span><span>{formatCurrency(billing.totalAmount)}</span></p>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            {(["CASH", "UPI"] as const).map((method) => (
              <button key={method} onClick={() => setPaymentMethod(method)}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${paymentMethod === method ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"}`}>
                {method}
              </button>
            ))}
          </div>
          {paymentMethod === "UPI" && <input value={paymentReference} onChange={(event) => setPaymentReference(event.target.value)}
            placeholder="UPI transaction reference" className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />}
          <button onClick={checkout} disabled={loading || cart.length === 0}
            className="mt-4 w-full rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white disabled:opacity-50">
            {loading ? "Processing..." : `Pay ${formatCurrency(billing.totalAmount)}`}
          </button>
        </aside>
      </div>
    </div>
  );
}
