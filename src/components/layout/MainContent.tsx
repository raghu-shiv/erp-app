import type { ReactNode } from "react";

export function MainContent({ children }: { children: ReactNode }) {
  return <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>;
}

