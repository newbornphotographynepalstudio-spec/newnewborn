import "server-only";

import { getAdminFirestore } from "@/lib/firebase/admin";
import type { MediaLibraryAsset, MediaLibraryCategory } from "@/lib/media/library-types";

function toIso(value: unknown): string {
  if (value && typeof value === "object" && "toDate" in value) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  return new Date().toISOString();
}

function docToAsset(id: string, data: FirebaseFirestore.DocumentData): MediaLibraryAsset {
  return {
    id,
    storagePath: data.storagePath,
    url: data.url,
    title: data.title ?? "",
    alt: data.alt ?? "",
    caption: data.caption,
    category: data.category ?? "other",
    featured: data.featured === true,
    published: data.published !== false,
    order: typeof data.order === "number" ? data.order : 0,
    contentType: data.contentType ?? "",
    sizeBytes: typeof data.sizeBytes === "number" ? data.sizeBytes : 0,
    width: typeof data.width === "number" ? data.width : undefined,
    height: typeof data.height === "number" ? data.height : undefined,
    createdAt: toIso(data.createdAt),
  };
}

export type MediaListResult = { configured: true; assets: MediaLibraryAsset[] } | { configured: false; assets: [] };

export async function listMedia(): Promise<MediaListResult> {
  try {
    const db = getAdminFirestore();
    const snapshot = await db.collection("media").get();
    const assets = snapshot.docs
      .map((doc) => docToAsset(doc.id, doc.data()))
      .sort((a, b) => a.order - b.order || b.createdAt.localeCompare(a.createdAt));
    return { configured: true, assets };
  } catch (error) {
    console.error("listMedia failed (Firebase Admin not configured?):", error);
    return { configured: false, assets: [] };
  }
}

export async function getMediaById(id: string): Promise<MediaLibraryAsset | null> {
  try {
    const db = getAdminFirestore();
    const doc = await db.collection("media").doc(id).get();
    if (!doc.exists) return null;
    return docToAsset(doc.id, doc.data()!);
  } catch (error) {
    console.error("getMediaById failed:", error);
    return null;
  }
}

/** Public read: published media in one category. Powers /portfolio/[category]/
 * alongside the existing approved static galleries — uploaded photos are
 * additive to that curated set, never a replacement for it. */
export async function getPublishedMediaByCategory(category: MediaLibraryCategory): Promise<MediaLibraryAsset[]> {
  try {
    const db = getAdminFirestore();
    const snapshot = await db
      .collection("media")
      .where("category", "==", category)
      .where("published", "==", true)
      .get();
    return snapshot.docs.map((doc) => docToAsset(doc.id, doc.data())).sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error("getPublishedMediaByCategory failed:", error);
    return [];
  }
}

/** Public read: every published, admin-marked-featured photo, for the
 * homepage Featured Work section. Empty array (not an error) when none
 * are marked featured, so the caller can fall back to the existing
 * hand-picked pairing rather than rendering nothing. */
export async function getFeaturedMedia(): Promise<MediaLibraryAsset[]> {
  try {
    const db = getAdminFirestore();
    const snapshot = await db.collection("media").where("featured", "==", true).where("published", "==", true).get();
    return snapshot.docs.map((doc) => docToAsset(doc.id, doc.data())).sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error("getFeaturedMedia failed:", error);
    return [];
  }
}
