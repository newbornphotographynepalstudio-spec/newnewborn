import "server-only";

import { getAdminFirestore } from "@/lib/firebase/admin";
import { getAdminAuth } from "@/lib/firebase/admin";
import { getSupabaseAdmin, isSupabaseConfigured, MEDIA_BUCKET } from "@/lib/supabase/admin";

export type SystemDiagnostics = {
  firestoreConnected: boolean;
  authConnected: boolean;
  mediaStorageConfigured: boolean;
  mediaStorageConnected: boolean;
  googlePlacesConfigured: boolean;
  /** A masked form of GOOGLE_PLACES_PLACE_ID (first/last few characters
   * only) so the admin can visually confirm the right place is
   * configured, without printing the full value into rendered HTML —
   * present only when googlePlacesConfigured is true. */
  googlePlacesIdMasked?: string;
  emailConfigured: boolean;
};

function maskMiddle(value: string): string {
  if (value.length <= 10) return `${value.slice(0, 2)}…${value.slice(-2)}`;
  return `${value.slice(0, 4)}…${value.slice(-4)}`;
}

/** Read-only, admin-only status checks — never returns or logs any secret
 * value, only booleans about whether each integration is reachable. Used
 * so the admin settings screen can show real configuration status instead
 * of either pretending everything works or asking the owner to guess.
 *
 * Media storage is Supabase Storage, not Firebase Storage — this project
 * stays on the Firebase Spark plan, which doesn't include Storage.
 * Firestore and Authentication remain entirely on Firebase. */
export async function getSystemDiagnostics(): Promise<SystemDiagnostics> {
  let firestoreConnected = false;
  try {
    const db = getAdminFirestore();
    await db.listCollections();
    firestoreConnected = true;
  } catch {
    firestoreConnected = false;
  }

  let authConnected = false;
  try {
    await getAdminAuth().listUsers(1);
    authConnected = true;
  } catch {
    authConnected = false;
  }

  const mediaStorageConfigured = isSupabaseConfigured();
  let mediaStorageConnected = false;
  if (mediaStorageConfigured) {
    try {
      const { error } = await getSupabaseAdmin().storage.from(MEDIA_BUCKET).list("", { limit: 1 });
      mediaStorageConnected = !error;
    } catch {
      mediaStorageConnected = false;
    }
  }

  const googlePlacesConfigured = Boolean(
    process.env.GOOGLE_PLACES_API_KEY && process.env.GOOGLE_PLACES_PLACE_ID
  );
  const googlePlacesIdMasked =
    googlePlacesConfigured && process.env.GOOGLE_PLACES_PLACE_ID
      ? maskMiddle(process.env.GOOGLE_PLACES_PLACE_ID)
      : undefined;

  const emailConfigured = Boolean(process.env.RESEND_API_KEY);

  return {
    firestoreConnected,
    authConnected,
    mediaStorageConfigured,
    mediaStorageConnected,
    googlePlacesConfigured,
    googlePlacesIdMasked,
    emailConfigured,
  };
}
