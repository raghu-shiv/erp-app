"use client";

export function PrintReceiptButton() {
  return <button onClick={() => window.print()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white print:hidden">Print receipt</button>;
}

