import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase admin client — server-only, privileged access.
 *
 * Used exclusively for Storage (Media Library uploads), since this
 * project stays on the Firebase Spark plan and Firebase Storage isn't
 * available. Firestore/Auth remain entirely on Firebase — this is not a
 * second application database, just an isolated adapter for one
 * capability Firebase's free tier doesn't cover here.
 *
 * `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security entirely — it
 * must never be prefixed `NEXT_PUBLIC_` or sent to the browser. The
 * `server-only` import above makes this module fail to build if it's
 * ever imported into a client component. `NEXT_PUBLIC_SUPABASE_URL` is
 * the project's public URL (not a secret — the same value the browser
 * would use for a client-side Supabase client, if this project had one).
 */

export const MEDIA_BUCKET = "media";

let cachedClient: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase credentials are missing. Set NEXT_PUBLIC_SUPABASE_URL and " +
        "SUPABASE_SERVICE_ROLE_KEY as environment variables (the service " +
        "role key server-only, never NEXT_PUBLIC_)."
    );
  }

  if (!cachedClient) {
    cachedClient = createClient(url, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cachedClient;
}
