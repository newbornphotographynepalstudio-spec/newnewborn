import "server-only";

import { getAdminFirestore } from "@/lib/firebase/admin";
import type { BlogPost } from "@/lib/blog/types";
import type { ServiceSlug } from "@/lib/data/service-pages";

function docToPost(id: string, data: FirebaseFirestore.DocumentData): BlogPost {
  return {
    id,
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt ?? "",
    content: data.content ?? "",
    featuredImageId: data.featuredImageId,
    author: data.author ?? "Newborn Photography Nepal",
    status: data.status === "published" ? "published" : "draft",
    publishedAt: toIso(data.publishedAt),
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    relatedServiceSlug: data.relatedServiceSlug || undefined,
    relatedAreaSlug: data.relatedAreaSlug || undefined,
    createdAt: toIso(data.createdAt) ?? new Date().toISOString(),
    updatedAt: toIso(data.updatedAt) ?? new Date().toISOString(),
  };
}

function toIso(value: unknown): string | undefined {
  if (!value) return undefined;
  if (typeof value === "object" && "toDate" in value) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  return undefined;
}

/** Public read: only published posts, newest first. No fake posts, no
 * posts shown before they're actually published. Sorted in memory rather
 * than with a Firestore `orderBy` alongside the `status` filter, which
 * would require a composite index to be deployed first — unnecessary
 * complexity at this post volume (a local studio's blog, not a
 * high-traffic publication). */
export async function getPublishedPosts(): Promise<BlogPost[]> {
  try {
    const db = getAdminFirestore();
    const snapshot = await db.collection("posts").where("status", "==", "published").get();
    return snapshot.docs
      .map((doc) => docToPost(doc.id, doc.data()))
      .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
  } catch (error) {
    console.error("getPublishedPosts failed:", error);
    return [];
  }
}

/** Every published post whose `relatedServiceSlug` matches this service —
 * reused by ServicePageLayout (SEO Phase 16) to link a service page back
 * to its existing supporting article(s) without hardcoding any slug or
 * title. Naturally picks up new articles later (or drops one that's
 * unpublished) with no code change, since it queries the same field the
 * admin PostForm already writes. Two equality filters, same pattern as
 * getPublishedPostBySlug — no composite index required. */
export async function getPublishedPostsByServiceSlug(slug: ServiceSlug): Promise<BlogPost[]> {
  try {
    const db = getAdminFirestore();
    const snapshot = await db
      .collection("posts")
      .where("relatedServiceSlug", "==", slug)
      .where("status", "==", "published")
      .get();
    return snapshot.docs
      .map((doc) => docToPost(doc.id, doc.data()))
      .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
  } catch (error) {
    console.error("getPublishedPostsByServiceSlug failed:", error);
    return [];
  }
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const db = getAdminFirestore();
    const snapshot = await db
      .collection("posts")
      .where("slug", "==", slug)
      .where("status", "==", "published")
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    return docToPost(snapshot.docs[0].id, snapshot.docs[0].data());
  } catch (error) {
    console.error("getPublishedPostBySlug failed:", error);
    return null;
  }
}
