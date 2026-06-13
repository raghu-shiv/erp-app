import type { ReactNode } from "react";
import { Panel } from "./Panel";

export function DataTable({ headings, children }: { headings: string[]; children: ReactNode }) {
  return <Panel className="overflow-hidden"><div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700"><thead className="bg-slate-50 dark:bg-slate-900/40"><tr>{headings.map((heading) => <th key={heading} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-700">{children}</tbody></table></div></Panel>;
}

