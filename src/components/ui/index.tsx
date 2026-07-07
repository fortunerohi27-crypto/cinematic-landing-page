"use client";

import React from "react";
import { cn } from "@/lib/cn";

// Re-exports for tree-shakeable imports of `cn` and the legacy components.
export { cn };
export { Button } from "./Button";
export { Input } from "./Input";
export { Textarea } from "./Textarea";
export { Card } from "./Card";
export { Table } from "./Table";
export { NewsletterForm } from "./NewsletterForm";

// Legacy components preserved exactly as before.

export function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("glass glass-card", className)}>
      {children}
    </div>
  );
}

export function GlowButton({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative px-8 py-3 rounded-full font-semibold text-white transition-all duration-300",
        "bg-premium-accent text-premium-black hover:scale-105 hover:shadow-[0_0_20px_rgba(0,242,255,0.6)]",
        "overflow-hidden group",
        className
      )}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
    </button>
  );
}