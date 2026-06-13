import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "success" | "danger" | "muted";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700",
  success: "bg-emerald-600 text-white hover:bg-emerald-700",
  danger: "text-red-600 hover:bg-red-50",
  muted: "bg-slate-100 text-slate-700 hover:bg-slate-200",
};

export function Button({ className = "", variant = "primary", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return <button className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`} {...props} />;
}

