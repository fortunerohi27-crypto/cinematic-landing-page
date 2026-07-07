// POST /api/public/auth/sign-up
// Body: { email, password, name? }
// Returns: { user: { id, email, name, role } } and sets the session cookie.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { signUpSchema } from "@/lib/validation";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { handle } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  return handle(async () => {
    const body = await req.json();
    const data = signUpSchema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return NextResponse.json({ error: "An account with that email already exists" }, { status: 409 });
    }

    const passwordHash = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name ?? null,
        role: "USER",
      },
    });

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
