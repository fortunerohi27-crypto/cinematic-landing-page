// Server- and client-safe. Renders plain HTML, no React hooks or browser APIs.

import React from "react";
import { cn } from "@/lib/cn";

interface Column<T> {
  key: keyof T & string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  rows: T[];
  columns: Column<T>[];
  emptyMessage?: string;
  className?: string;
  loading?: boolean;
}

// Generic data table. Used by the admin pages.
export function Table<T extends { id: string | number }>({
  rows,
  columns,
  emptyMessage = "Nothing here yet.",
  className,
  loading = false,
}: TableProps<T>) {
  return (
    <div className={cn("overflow-x-auto rounded-2xl border border-white/10", className)}>
      <table className="w-full text-left text-sm">
        <thead className="bg-white/5 text-white/40 uppercase text-xs tracking-widest">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={cn("px-4 py-3 font-semibold", c.className)}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-white/40 italic">
                Loading…
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-white/40 italic">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="hover:bg-white/5 transition-colors">
                {columns.map((c) => (
                  <td key={c.key} className={cn("px-4 py-3 align-top", c.className)}>
                    {c.render ? c.render(row) : (row[c.key] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}