/**
 * The admin session cookie's name and lifetime — shared between the Edge
 * middleware (proxy.ts, which cannot import the Node-only Admin SDK) and
 * the Node.js server code that actually mints/verifies it
 * (lib/firebase/session.ts, app/api/admin/session/route.ts). Kept in its
 * own module with no server-only/Admin SDK imports so both runtimes can
 * import it safely.
 */
export const SESSION_COOKIE_NAME = "__session";

/** 5 days, in seconds — matches the Firebase session cookie's max lifetime. */
export const SESSION_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 5;
