"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCart, type PosProduct } from "@/contexts/cart-context";
import { formatCurrency } from "@/lib/billing";
import { useMemo, useState, type FormEvent, type KeyboardEvent } from "react";

export function ProductCatalog({ products, onError }: { products: PosProduct[]; onError: (message: string) => void }) {
  const { addProduct } = useCart();
  const [search, setSearch] = useState("");
  const [barcode, setBarcode] = useState("");
  const visibleProducts = useMemo(() => products.filter((product) =>
    `${product.name} ${product.sku} ${product.barcode ?? ""}`.toLowerCase().includes(search.toLowerCase()),
  ), [products, search]);

  function add(product: PosProduct) {
    if (!addProduct(product)) {
      onError(`Only ${product.stockQuantity} ${product.unit} available for ${product.name}.`);
      return;
    }
    onError("");
  }

  function addScannedProduct() {
    const term = barcode.trim();
    const product = products.find((item) => item.barcode === term || item.sku === term);
    if (!product) {
      onError("No active product matches that barcode or SKU.");
      return;
    }
    add(product);
    setBarcode("");
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    addScannedProduct();
  }

  function handleScannerKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      addScannedProduct();
    }
  }

  return <section className="space-y-4">
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input value={barcode} onChange={(event) => setBarcode(event.target.value)} onKeyDown={handleScannerKeyDown} autoFocus placeholder="Scan barcode or enter SKU" className="py-3" />
      <Button type="submit">Add</Button>
    </form>
    <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search product catalog" className="py-3" />
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {visibleProducts.map((product) => <button key={product.id} onClick={() => add(product)} disabled={product.stockQuantity === 0}
        className="rounded-xl border border-slate-200 bg-white p-4 text-left transition-colors hover:border-indigo-300 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800">
        <p className="font-semibold text-slate-800 dark:text-white">{product.name}</p>
        <p className="mt-1 text-xs text-slate-500">{product.sku} | {product.category}</p>
        <div className="mt-3 flex justify-between text-sm"><span className="font-semibold text-indigo-600">{formatCurrency(product.price)}</span><span className="text-slate-500">{product.stockQuantity} {product.unit}</span></div>
      </button>)}
    </div>
  </section>;
}

