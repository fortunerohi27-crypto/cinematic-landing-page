// Session lifecycle: create / fetch / destroy.
//
// Sessions are opaque random tokens stored in the Session table. The cookie
// carries the token. Lookups are O(1) on the unique index.

import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { SESSION_COOKIE, SESSION_TTL_MS, setSessionCookie, clearSessionCookie } from "./cookies";

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: "USER" | "ADMIN";
}

export interface SessionContext {
  user: SessionUser;
  sessionId: string;
}

function generateToken(): string {
  return randomBytes(32).toString("hex");
}

export async function createSession(userId: string): Promise<string> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await prisma.session.create({
    data: { token, userId, expiresAt },
  });

  setSessionCookie(token);
  return token;
}

export async function getSession(): Promise<SessionContext | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const row = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!row) return null;
  if (row.expiresAt < new Date()) {
    // Expired — clean it up
    await prisma.session.delete({ where: { id: row.id } }).catch(() => {});
    return null;
  }

  return {
    sessionId: row.id,
    user: {
      id: row.user.id,
      email: row.user.email,
      name: row.user.name,
      role: row.user.role === "ADMIN" ? "ADMIN" : "USER",
    },
  };
}

export async function destroySession(): Promise<void> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { token } }).catch(() => {});
  }
  clearSessionCookie();
}
