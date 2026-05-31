import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — ERP POS System",
  description: "Sign in to the ERP POS management system",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
