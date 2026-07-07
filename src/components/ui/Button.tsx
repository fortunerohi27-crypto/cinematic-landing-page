"use client";

import React from "react";
import { cn } from "@/lib/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps) {
  const sizeClass = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-3 text-base",
  }[size];

  const variantClass = {
    primary:
      "bg-premium-accent text-premium-black hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,242,255,0.4)]",
    secondary:
      "bg-white/5 text-white border border-white/10 hover:bg-white/10",
    ghost: "bg-transparent text-white/70 hover:text-white",
    danger:
      "bg-red-500/20 text-red-200 border border-red-500/30 hover:bg-red-500/30",
  }[variant];

  return (
    <button
      className={cn(
        "rounded-full font-semibold uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
        sizeClass,
        variantClass,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}