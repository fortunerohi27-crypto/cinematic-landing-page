"use client";

// /sign-up — create a new account. Auto-signs in on success.

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { apiFetch, ApiError } from "@/lib/api";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await apiFetch("/api/public/auth/sign-up", {
        method: "POST",
        json: { name: name || undefined, email, password },
      });
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-2 text-white">Join Nex</h1>
          <p className="text-white/50 text-sm mb-8">Create your studio account.</p>

          <form onSubmit={onSubmit} className="space-y-6">
            <Input
              label="Name (optional)"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              minLength={8}
            />

            {error && <p className="text-sm text-red-400">{error}</p>}

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Creating…" : "Create account"}
            </Button>

            <p className="text-center text-sm text-white/50">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-premium-accent hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </main>
  );
}