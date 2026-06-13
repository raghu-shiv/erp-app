import Link from "next/link";
import { AppLogo } from "./AppLogo";

const links = [
  ["Dashboard", "/dashboard"],
  ["POS Terminal", "/pos"],
  ["Inventory", "/inventory"],
  ["Purchases", "/purchases"],
  ["Orders", "/orders"],
  ["Reports", "/reports"],
];

export function Sidebar({ name, role }: { name: string; role: string }) {
  return <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex dark:border-slate-700 dark:bg-slate-800"><div className="border-b border-slate-200 px-6 py-5 dark:border-slate-700"><AppLogo /></div><nav className="flex-1 space-y-1 px-4 py-4">{links.map(([label, href]) => <Link key={href} href={href} className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700">{label}</Link>)}</nav><div className="border-t border-slate-200 px-4 py-4 dark:border-slate-700"><div className="flex items-center gap-3 px-3 py-2"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">{name.charAt(0).toUpperCase()}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{name}</p><p className="text-xs capitalize text-slate-500">{role.toLowerCase().replace("_", " ")}</p></div></div></div></aside>;
}
