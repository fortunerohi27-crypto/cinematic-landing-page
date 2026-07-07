// Server- and client-safe. Just renders a styled div.

import React from "react";
import { cn } from "@/lib/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn("glass glass-card", className)}>
      {children}
    </div>
  );
}