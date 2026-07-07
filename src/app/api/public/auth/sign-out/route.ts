// POST /api/public/auth/sign-out
// Returns: {} and clears the session cookie.

import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth/session";
import { handle } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

export async function POST() {
  return handle(async () => {
    await destroySession();
    return NextResponse.json({ ok: true });
  });
}
