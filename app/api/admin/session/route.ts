import { NextResponse, type NextRequest } from "next/server";

import { getAdminAuth } from "@/lib/firebase/admin";
import {
  SESSION_COOKIE_MAX_AGE_SECONDS,
  SESSION_COOKIE_NAME,
} from "@/lib/firebase/session-cookie";

/**
 * Mints/clears the admin `__session` cookie. This is the only place a
 * client-supplied credential (a Firebase ID token, from the client SDK
 * sign-in in AdminLoginForm) is ever exchanged for the server-trusted
 * session cookie — and only after two checks: the ID token is genuinely
 * valid (verifyIdToken, cryptographic), AND the resulting user carries the
 * `admin` custom claim. A real, currently-signed-in Firebase user who
 * lacks that claim is refused a session cookie, not silently granted one —
 * "has a Firebase account" and "is an admin" are deliberately different
 * things (see docs/SETUP.md for how the claim gets set; there is no
 * self-serve admin signup).
 */
export async function POST(request: NextRequest) {
  let idToken: unknown;
  try {
    ({ idToken } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof idToken !== "string" || idToken.length === 0) {
    return NextResponse.json({ error: "Missing ID token." }, { status: 400 });
  }

  let auth;
  try {
    auth = getAdminAuth();
  } catch (error) {
    console.error("POST /api/admin/session: Firebase Admin not configured:", error);
    return NextResponse.json(
      { error: "Admin sign-in isn't configured on this server yet." },
      { status: 500 }
    );
  }

  let decoded;
  try {
    decoded = await auth.verifyIdToken(idToken);
  } catch {
    return NextResponse.json({ error: "Invalid or expired sign-in." }, { status: 401 });
  }

  if (decoded.admin !== true) {
    return NextResponse.json(
      { error: "This account isn't authorized for admin access." },
      { status: 403 }
    );
  }

  let sessionCookie: string;
  try {
    sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_COOKIE_MAX_AGE_SECONDS * 1000,
    });
  } catch {
    return NextResponse.json({ error: "Couldn't create a session." }, { status: 500 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
  });
  return response;
}

/** Signs out: clears the session cookie. The client also calls Firebase's
 * own signOut() so the client SDK's local auth state matches. */
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
