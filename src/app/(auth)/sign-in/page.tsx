"use client";

// /sign-in — email + password. Redirects to `?next=` on success, default "/".

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { apiFetch, ApiError } from "@/lib/api";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await apiFetch("/api/public/auth/sign-in", {
        method: "POST",
        json: { email, password },
      });
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <Card className="p-8">
      <h1 className="text-3xl font-bold mb-2 text-white">Welcome back</h1>
      <p className="text-white/50 text-sm mb-8">Sign in to your Nex account.</p>

      <form onSubmit={onSubmit} className="space-y-6">
        <Input
          label="Email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@nex.studio"
        />
        <Input
          label="Password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Signing in…" : "Sign in"}
        </Button>

        <p className="text-center text-sm text-white/50">
          No account yet?{" "}
          <Link href="/sign-up" className="text-premium-accent hover:underline">
            Create one
          </Link>
        </p>
      </form>
    </Card>
  );
}

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        <Suspense fallback={<div className="text-white/40">Loading…</div>}>
          <SignInForm />
        </Suspense>
      </div>
    </main>
  );
}