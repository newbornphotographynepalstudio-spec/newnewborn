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
    category: data.category ?? "other",
    featured: data.featured === true,
    published: data.published !== false,
    order: typeof data.order === "number" ? data.order : 0,
    contentType: data.contentType ?? "",
    sizeBytes: typeof data.sizeBytes === "number" ? data.sizeBytes : 0,
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

/** Public read: published media in one category, for future wiring into
 * public pages. Not yet called from any public route — the existing
 * approved static galleries remain authoritative for now (see
 * docs/ARCHITECTURE.md); this exists so that wiring is additive later,
 * not a rewrite. */
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
