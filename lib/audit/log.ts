import "server-only";

import { FieldValue } from "firebase-admin/firestore";
import type { DecodedIdToken } from "firebase-admin/auth";

import { getAdminFirestore } from "@/lib/firebase/admin";

export type AuditEntry = {
  actorUid: string;
  actorEmail: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: string;
};

/**
 * Records one privileged admin mutation. Best-effort: a logging failure
 * must never block or fail the real mutation it's describing, so every
 * error is swallowed (and reported server-side only) rather than thrown.
 * Never pass anything secret in `details` — this collection is read back
 * verbatim on /admin/security/.
 */
export async function writeAuditLog(entry: AuditEntry): Promise<void> {
  try {
    const db = getAdminFirestore();
    await db.collection("auditLogs").add({
      ...entry,
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error("writeAuditLog failed:", error);
  }
}

/** Convenience wrapper for the common case: log from a verified admin
 * session's decoded token rather than building the actor fields by hand
 * at every call site. */
export function auditActorFromSession(session: DecodedIdToken): Pick<AuditEntry, "actorUid" | "actorEmail"> {
  return { actorUid: session.uid, actorEmail: session.email ?? "unknown" };
}
