"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useMemo, useState, useTransition } from "react";

type ProductOption = {
  id: string;
  name: string;
  sku: string;
  barcode: string | null;
  stockQuantity: number;
};

type SupplierOption = {
  id: string;
  name: string;
};

function parseLines(text: string) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [lookup, quantity] = line.split(",").map((part) => part.trim());
      return { lookup, quantity: Number(quantity) };
    });
}

export function StockInwardForm({ products, suppliers }: { products: ProductOption[]; suppliers: SupplierOption[] }) {
  const [lookup, setLookup] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [referenceId, setReferenceId] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [reason, setReason] = useState("Stock inward");
  const [bulkLines, setBulkLines] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const datalistOptions = useMemo(() => products.flatMap((product) => [
    `${product.sku} - ${product.name}`,
    ...(product.barcode ? [`${product.barcode} - ${product.name}`] : []),
  ]), [products]);

  const submit = () => {
    setError("");
    setMessage("");

    const lines = bulkLines.trim().length > 0 ? parseLines(bulkLines) : [{ lookup, quantity }];
    const normalizedLines = lines.map((line) => ({
      lookup: line.lookup.split(" - ")[0]?.trim() ?? line.lookup,
      quantity: line.quantity,
    }));

    startTransition(async () => {
      const response = await fetch("/api/purchases/stock-inward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referenceId: referenceId || null,
          supplierId: supplierId || null,
          reason,
          lines: normalizedLines,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload.error ?? "Stock inward failed.");
        return;
      }

      setMessage(`Stock inward posted for ${payload.products.length} product(s).`);
      setLookup("");
      setQuantity(1);
      setBulkLines("");
    });
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <label className="text-sm font-medium">
          Supplier
          <select value={supplierId} onChange={(event) => setSupplierId(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white">
            <option value="">No supplier selected</option>
            {suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium">
          Reference / invoice
          <Input value={referenceId} onChange={(event) => setReferenceId(event.target.value)} placeholder="PO-001 or INV-1024" />
        </label>
        <label className="text-sm font-medium">
          Reason
          <Input value={reason} onChange={(event) => setReason(event.target.value)} />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_160px_auto]">
        <label className="text-sm font-medium">
          Scan barcode / enter SKU
          <Input list="stock-inward-products" value={lookup} onChange={(event) => setLookup(event.target.value)} placeholder="Scan barcode or type SKU" />
          <datalist id="stock-inward-products">
            {datalistOptions.map((option) => <option key={option} value={option} />)}
          </datalist>
        </label>
        <label className="text-sm font-medium">
          Quantity
          <Input type="number" min={1} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} />
        </label>
        <div className="flex items-end">
          <Button type="button" onClick={submit} disabled={isPending || (!lookup.trim() && !bulkLines.trim())}>
            Post inward
          </Button>
        </div>
      </div>

      <label className="block text-sm font-medium">
        Manual upload
        <textarea value={bulkLines} onChange={(event) => setBulkLines(event.target.value)} placeholder={"One item per line: SKU-or-barcode, quantity\nGRO-001, 12\n8901234560002, 5"} className="mt-1 min-h-32 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white" />
        <span className="mt-1 block text-xs text-slate-500">Bulk lines override the single scan field when provided.</span>
      </label>

      {error ? <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      {message ? <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
    </div>
  );
}
