// Route-handler guards. Throw a Response to abort the handler with the right
// status. Route handlers catch and return these directly.
//
// Usage:
//   const user = await requireUser();   // 401 if not signed in
//   const admin = await requireAdmin(); // 401 / 403 with correct status

import { NextResponse } from "next/server";
import { getSession, type SessionUser } from "./session";

export class AuthError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function requireUser(): Promise<SessionUser> {
  const ctx = await getSession();
  if (!ctx) throw new AuthError(401, "Not authenticated");
  return ctx.user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "ADMIN") throw new AuthError(403, "Admin access required");
  return user;
}

/**
 * Convert any thrown value in a route handler into a JSON Response.
 * Use as: `return handle(async () => { ... })`
 */
export async function handle<T>(fn: () => Promise<T | NextResponse>): Promise<NextResponse> {
  try {
    const result = await fn();
    if (result instanceof NextResponse) return result;
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    if (err instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    if (err instanceof Error) {
      // Zod errors have a `issues` array
      const issues = (err as { issues?: unknown }).issues;
      if (Array.isArray(issues)) {
        return NextResponse.json({ error: "Validation failed", issues }, { status: 400 });
      }
      console.error("[handle] unexpected error:", err);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
