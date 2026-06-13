import type { ReactNode } from "react";
import { Header } from "./Header";
import { MainContent } from "./MainContent";
import { Sidebar } from "./Sidebar";

export function AppShell({ children, name, role }: { children: ReactNode; name: string; role: string }) {
  return <div className="flex h-screen bg-slate-50 dark:bg-slate-900"><Sidebar name={name} role={role} /><div className="flex flex-1 flex-col overflow-hidden"><Header name={name} role={role} /><MainContent>{children}</MainContent></div></div>;
}
