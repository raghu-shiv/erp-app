"use client";

import { AppLogo } from "@/components/layout/AppLogo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await authClient.signIn.email({ email, password });
      if (result.error) setError("Invalid email or password");
      else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
    <div className="w-full max-w-md">
      <div className="mb-8 flex justify-center"><div className="rounded-xl bg-white p-3"><AppLogo /></div></div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="text-center text-2xl font-bold text-white">Sign in to ERP POS</h1>
        <p className="mt-1 text-center text-sm text-slate-400">Use your staff account to continue.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {error && <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-400">{error}</p>}
          <label className="block text-sm font-medium text-slate-300">Email<Input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@company.com" className="mt-1.5" /></label>
          <label className="block text-sm font-medium text-slate-300">Password<Input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="********" className="mt-1.5" /></label>
          <Button type="submit" disabled={loading} className="w-full py-2.5">{loading ? "Signing in..." : "Sign In"}</Button>
        </form>
      </div>
    </div>
  </div>;
}

