// Tailwind class-name utility. Re-exported by components/ui/index.tsx as `cn`.
//
// Kept separate from `ui/index.tsx` (which is "use client") so that server
// components and route handlers can import this without dragging in client deps.

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
