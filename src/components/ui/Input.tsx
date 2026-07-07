"use client";

import React from "react";
import { cn } from "@/lib/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...rest }, ref) => {
    const inputId = id ?? React.useId();
    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs uppercase tracking-widest text-white/40 font-bold"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-premium-accent transition-colors",
            error && "border-red-500/50 focus:border-red-500",
            className,
          )}
          {...rest}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  },
);
Input.displayName = "Input";