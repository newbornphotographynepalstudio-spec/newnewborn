/**
 * Admin authorization model (foundation only — Phase 1).
 *
 * Roles are never trusted from the client. In Phase 2, a role is assigned
 * as a Firebase custom claim on the user's ID token by a trusted server
 * context (e.g. an admin-only Server Action using the Firebase Admin SDK),
 * and every privileged read/write is checked server-side — either in a
 * Server Action / Route Handler against the decoded token, or via Firestore
 * Security Rules reading `request.auth.token.role`. The client may read a
 * role for UI purposes only (e.g. hiding a menu item); it must never be the
 * source of an authorization decision.
 */

export const ADMIN_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "EDITOR",
  "PHOTOGRAPHER_STAFF",
] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

/**
 * Coarse capability tiers used to gate admin sections. Kept intentionally
 * simple for a small admin team; expand per-module as real needs surface
 * (e.g. splitting "publish" from "edit" on blog content).
 */
export const ROLE_RANK: Record<AdminRole, number> = {
  SUPER_ADMIN: 4,
  ADMIN: 3,
  EDITOR: 2,
  PHOTOGRAPHER_STAFF: 1,
};

export function roleAtLeast(role: AdminRole, minimum: AdminRole): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[minimum];
}
