// Edge middleware. Protects /admin/* and /dashboard/* by redirecting
// unauthenticated users to /sign-in. Runs on the Edge runtime, so we can't
// touch the database here — we just check for the presence of the session
// cookie. The actual validity check happens server-side in the page/route
// handler via getSession().

import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "nex_session";

const PROTECTED_PREFIXES = ["/admin", "/dashboard"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (!isProtected) return NextResponse.next();

  const hasSession = req.cookies.get(SESSION_COOKIE)?.value;
  if (!hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Skip static assets and Next internals
  matcher: ["/((?!_next/|favicon.ico|assets/).*)"],
};
