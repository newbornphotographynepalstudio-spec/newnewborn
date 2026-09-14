import "server-only";

import { getAdminFirestore } from "@/lib/firebase/admin";
import { getAdminStorage } from "@/lib/firebase/admin";

export type SystemDiagnostics = {
  firestoreConnected: boolean;
  storageEnabled: boolean;
  googlePlacesConfigured: boolean;
};

/** Read-only, admin-only status checks — never returns or logs any secret
 * value, only booleans about whether each integration is reachable. Used
 * so the admin settings screen can show real configuration status instead
 * of either pretending everything works or asking the owner to guess. */
export async function getSystemDiagnostics(): Promise<SystemDiagnostics> {
  let firestoreConnected = false;
  try {
    const db = getAdminFirestore();
    await db.listCollections();
    firestoreConnected = true;
  } catch {
    firestoreConnected = false;
  }

  let storageEnabled = false;
  try {
    const bucket = getAdminStorage().bucket();
    const [exists] = await bucket.exists();
    storageEnabled = exists;
  } catch {
    storageEnabled = false;
  }

  const googlePlacesConfigured = Boolean(
    process.env.GOOGLE_PLACES_API_KEY && process.env.GOOGLE_PLACES_PLACE_ID
  );

  return { firestoreConnected, storageEnabled, googlePlacesConfigured };
}
