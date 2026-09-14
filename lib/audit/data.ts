import "server-only";

import { getAdminFirestore } from "@/lib/firebase/admin";

export type AuditLogEntry = {
  id: string;
  actorUid: string;
  actorEmail: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: string;
  createdAt: string;
};

export type AuditLogResult = { configured: true; entries: AuditLogEntry[] } | { configured: false; entries: [] };

function toIso(value: unknown): string {
  if (value && typeof value === "object" && "toDate" in value) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  return new Date().toISOString();
}

/** Most recent 50 audit entries. No pagination yet — this business's
 * admin mutation volume doesn't justify it, and a simple recent-first
 * list is what's actually useful day to day. */
export async function listAuditLog(): Promise<AuditLogResult> {
  try {
    const db = getAdminFirestore();
    const snapshot = await db.collection("auditLogs").orderBy("createdAt", "desc").limit(50).get();
    const entries = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        actorUid: data.actorUid,
        actorEmail: data.actorEmail,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        details: data.details,
        createdAt: toIso(data.createdAt),
      };
    });
    return { configured: true, entries };
  } catch (error) {
    console.error("listAuditLog failed:", error);
    return { configured: false, entries: [] };
  }
}
