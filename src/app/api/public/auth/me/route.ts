// GET /api/public/auth/me
// Returns: { user } or 401.

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { handle } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

export async function GET() {
  return handle(async () => {
    const ctx = await getSession();
    if (!ctx) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    return NextResponse.json({ user: ctx.user });
  });
}
