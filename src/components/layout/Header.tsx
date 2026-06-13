import { AppLogo } from "./AppLogo";
import { LogoutButton } from "./LogoutButton";

export function Header({ name, role }: { name: string; role: string }) {
  return <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-700 dark:bg-slate-800"><div className="lg:hidden"><AppLogo /></div><h2 className="hidden text-lg font-semibold lg:block">ERP POS</h2><div className="flex items-center gap-3"><div className="hidden text-right sm:block"><p className="text-sm font-medium text-slate-900 dark:text-white">{name}</p><p className="text-xs capitalize text-slate-500 dark:text-slate-400">{role.toLowerCase().replace("_", " ")}</p></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-500 dark:bg-slate-700 dark:text-slate-400 sm:hidden">{role.toLowerCase().replace("_", " ")}</span><LogoutButton /></div></header>;
}
