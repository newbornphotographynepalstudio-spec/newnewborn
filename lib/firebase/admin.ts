import "server-only";

/**
 * Firebase Admin SDK — server-only, privileged access.
 *
 * The `server-only` import above makes this module fail to build if it is
 * ever imported from a client component or the browser bundle. Credentials
 * come from server-side environment variables and must never be prefixed
 * with NEXT_PUBLIC_.
 *
 * No service account is created or committed by this scaffold — set these
 * env vars locally (see .env.example / docs/SETUP.md) and in Vercel's
 * server-only environment variable settings.
 */

import {
  type App,
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage, type Storage } from "firebase-admin/storage";

function getAdminApp(): App {
  const existing = getApps();
  if (existing.length > 0) {
    return existing[0];
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin SDK credentials are missing. Set FIREBASE_PROJECT_ID, " +
        "FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY as server-only " +
        "environment variables."
    );
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

export function getAdminAuth(): Auth {
  return getAuth(getAdminApp());
}

let firestoreConfigured = false;

/**
 * `ignoreUndefinedProperties` lets callers write documents built with
 * optional fields left as `undefined` (e.g. `readOptionalString()` in
 * lib/inquiries/actions.ts) without manually stripping each one first.
 * The Admin SDK rejects `undefined` values by default. `.settings()` may
 * only be called once per Firestore instance, before any read/write, so
 * this guards against re-applying it on every call.
 */
export function getAdminFirestore(): Firestore {
  const db = getFirestore(getAdminApp());
  if (!firestoreConfigured) {
    db.settings({ ignoreUndefinedProperties: true });
    firestoreConfigured = true;
  }
  return db;
}

export function getAdminStorage(): Storage {
  return getStorage(getAdminApp());
}
