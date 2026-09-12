import { NextResponse, type NextRequest } from "next/server";

/**
 * Admin route gate — foundation only.
 *
 * Middleware runs on the Edge runtime, where the Firebase Admin SDK cannot
 * run (it needs Node.js). So this layer only checks for the *presence* of
 * a session cookie and redirects unauthenticated visitors to /admin/login;
 * it is a UX gate, not the authorization boundary.
 *
 * The real authorization boundary is server-side, in Node.js: every admin
 * Server Action / Route Handler must independently verify the session
 * cookie with the Firebase Admin SDK (getAdminAuth().verifySessionCookie)
 * and check the decoded token's role claim before doing anything
 * privileged. Firestore Security Rules provide defense in depth for direct
 * client SDK access. Client-supplied role/claim values are never trusted.
 */

const SESSION_COOKIE_NAME = "__session";

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
