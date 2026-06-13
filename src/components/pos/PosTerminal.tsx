"use client";

import { CartProvider, type PosProduct } from "@/contexts/cart-context";
import { useState } from "react";
import { CartPanel } from "./CartPanel";
import { ProductCatalog } from "./ProductCatalog";
import { ReceiptBanner } from "./ReceiptBanner";

export function PosTerminal({ products }: { products: PosProduct[] }) {
  return <CartProvider><TerminalContent products={products} /></CartProvider>;
}

function TerminalContent({ products }: { products: PosProduct[] }) {
  const [error, setError] = useState("");
  return <div className="space-y-6">
    <ReceiptBanner />
    {error && <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    <div className="grid gap-6 xl:grid-cols-[1fr_420px]"><ProductCatalog products={products} onError={setError} /><CartPanel onError={setError} /></div>
  </div>;
}

