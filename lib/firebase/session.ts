import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { DecodedIdToken } from "firebase-admin/auth";

import { getAdminAuth } from "@/lib/firebase/admin";
import { SESSION_COOKIE_NAME } from "@/lib/firebase/session-cookie";

/**
 * The real authorization boundary for /admin/*, in Node.js — see proxy.ts
 * for why the Edge middleware can only check cookie *presence*, not
 * validity. Everything here runs server-side and never trusts a
 * client-supplied claim: `admin` is a custom claim set on the Firebase
 * user record itself (via the Admin SDK, out-of-band — see
 * docs/SETUP.md), not something read from request data.
 */

/**
 * Verifies the `__session` cookie against Firebase and returns the
 * decoded token only if it's a valid, non-revoked session AND the user
 * carries the `admin` custom claim. Returns `null` for anything else
 * (missing cookie, expired/forged cookie, or a real-but-non-admin user) —
 * callers must treat every `null` the same way, as "not authorized".
 */
export async function verifyAdminSession(): Promise<DecodedIdToken | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) {
    return null;
  }

  try {
    const decoded = await getAdminAuth().verifySessionCookie(sessionCookie, true);
    if (decoded.admin !== true) {
      return null;
    }
    return decoded;
  } catch {
    // Expired, revoked, or forged cookie — verifySessionCookie throws for
    // all of these; there's nothing case-specific to do with the error.
    return null;
  }
}

/**
 * For use at the top of every protected admin page/layout and every
 * admin Server Action: redirects to /admin/login when there's no valid
 * admin session, otherwise returns the decoded token. This is the one
 * place "is this request actually an authenticated admin" gets answered —
 * nothing downstream should re-derive that from a cookie's presence.
 */
export async function requireAdminSession(): Promise<DecodedIdToken> {
  const decoded = await verifyAdminSession();
  if (!decoded) {
    redirect("/admin/login");
  }
  return decoded;
}
