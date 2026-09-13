import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE_NAME } from "@/lib/firebase/session-cookie";

/**
 * Admin route gate — a UX redirect, not the authorization boundary.
 *
 * Middleware runs on the Edge runtime, where the Firebase Admin SDK cannot
 * run (it needs Node.js). So this layer only checks for the *presence* of
 * a session cookie and redirects unauthenticated visitors to /admin/login;
 * a forged or expired cookie value still passes this check.
 *
 * The real authorization boundary is server-side, in Node.js:
 * app/admin/(protected)/layout.tsx calls requireAdminSession()
 * (lib/firebase/session.ts) on every protected admin page, which
 * cryptographically verifies the session cookie with the Firebase Admin
 * SDK (verifySessionCookie) and checks the decoded token's `admin` custom
 * claim — redirecting to /admin/login if it's missing, expired, or
 * forged. Every admin Server Action (e.g. updateInquiryStatus in
 * lib/inquiries/actions.ts) independently calls the same helper, since a
 * Server Action can be invoked directly and isn't guaranteed to only run
 * from a page that already checked. Firestore Security Rules provide
 * defense in depth for any direct client SDK access. Client-supplied
 * role/claim values are never trusted anywhere in this chain.
 */

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname.startsWith("/admin/login");

  if (isAdminRoute && !isLoginRoute) {
    const hasSession = request.cookies.has(SESSION_COOKIE_NAME);
    if (!hasSession) {
      const loginUrl = new URL("/admin/login/", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
