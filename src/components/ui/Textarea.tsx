"use client";

import React from "react";
import { cn } from "@/lib/cn";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
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
        <textarea
          id={inputId}
          ref={ref}
          className={cn(
            "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-premium-accent transition-colors resize-y min-h-[100px]",
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
Textarea.displayName = "Textarea";