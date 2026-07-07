// POST /api/public/auth/sign-in
// Body: { email, password }
// Returns: { user } and sets the session cookie.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { signInSchema } from "@/lib/validation";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { handle } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  return handle(async () => {
    const body = await req.json();
    const data = signInSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const ok = await verifyPassword(data.password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    await createSession(user.id);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  });
}
