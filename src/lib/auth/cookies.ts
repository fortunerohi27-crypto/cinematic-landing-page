// Session-cookie helpers. Single source of truth for cookie name + options.

import { cookies } from "next/headers";

export const SESSION_COOKIE = "nex_session";
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

export function getSessionCookieName(): string {
  return SESSION_COOKIE;
}

export function setSessionCookie(token: string): void {
  cookies().set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export function clearSessionCookie(): void {
  cookies().set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
