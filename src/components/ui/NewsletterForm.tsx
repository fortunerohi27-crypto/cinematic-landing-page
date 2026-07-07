"use client";

// Reusable newsletter signup form. Uses fetch + the apiFetch helper.
// Status is local-only: idle / submitting / success / error.

import React, { useState } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import { apiFetch, ApiError } from "@/lib/api";

type Status = "idle" | "submitting" | "success" | "error";

export function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");
    try {
      await apiFetch("/api/public/newsletter/subscribe", {
        method: "POST",
        json: { email },
      });
      setStatus("success");
      setMessage("You're in. Watch your inbox.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof ApiError ? err.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={onSubmit} className={className}>
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          required
          placeholder="you@nex.studio"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "submitting"}
          className="flex-1"
          aria-label="Email address"
        />
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Subscribe"}
        </Button>
      </div>
      {message && (
        <p
          className={
            "mt-3 text-xs " +
            (status === "success" ? "text-premium-accent" : "text-red-400")
          }
        >
          {message}
        </p>
      )}
    </form>
  );
}