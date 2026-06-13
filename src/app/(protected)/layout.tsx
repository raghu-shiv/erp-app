import { AppShell } from "@/components/layout/AppShell";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentSession();
  if (!session?.user || !session.user.isActive) redirect("/login");
  return <AppShell name={session.user.name} role={session.user.role}>{children}</AppShell>;
}
