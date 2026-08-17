"use client";

import { useState } from "react";
import Image from "next/image";
import { ApiError, login } from "@/lib/admin/api";

/*
 * No success callback: a successful sign-in writes the token, the token store
 * announces it, and the shell swaps this form out on its own.
 */
export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Sign-in failed");
      setPassword("");
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <Image src="/icon.png" alt="" width={80} height={80} className="h-9 w-9 object-contain" />
          <div>
            <p className="font-display text-lg leading-none text-chalk">Content admin</p>
            <p className="label-micro mt-1.5 text-gray-600">ProEduvate</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4 border border-white/10 bg-white/[0.02] p-6">
          <div>
            <label htmlFor="admin-email" className="label-micro mb-2 block text-gray-400">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-white/12 bg-black/40 px-3 py-2 text-sm text-chalk outline-none transition-colors focus:border-accent/70"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="label-micro mb-2 block text-gray-400">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-white/12 bg-black/40 px-3 py-2 text-sm text-chalk outline-none transition-colors focus:border-accent/70"
            />
          </div>

          {error && (
            <p className="border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-warning">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-accent px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs leading-relaxed text-gray-600">
          Editor accounts only. Your session ends when you close this tab.
        </p>
      </div>
    </div>
  );
}
