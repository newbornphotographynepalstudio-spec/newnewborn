import "server-only";

import { getAdminFirestore } from "@/lib/firebase/admin";
import type { BlogPost } from "@/lib/blog/types";

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

export type PostListResult = { configured: true; posts: BlogPost[] } | { configured: false; posts: [] };

/** Admin-only read of every post (draft and published), newest-created
 * first. */
export async function listAllPosts(): Promise<PostListResult> {
  try {
    const db = getAdminFirestore();
    const snapshot = await db.collection("posts").get();
    const posts = snapshot.docs
      .map((doc) => docToPost(doc.id, doc.data()))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return { configured: true, posts };
  } catch (error) {
    console.error("listAllPosts failed (Firebase Admin not configured?):", error);
    return { configured: false, posts: [] };
  }
}

export async function getPostByIdAdmin(id: string): Promise<BlogPost | null> {
  try {
    const db = getAdminFirestore();
    const doc = await db.collection("posts").doc(id).get();
    if (!doc.exists) return null;
    return docToPost(doc.id, doc.data()!);
  } catch (error) {
    console.error("getPostByIdAdmin failed:", error);
    return null;
  }
}

/** Checks whether a slug is already in use by a different post, so the
 * form can reject a duplicate before it ever hits two posts with the
 * same public URL. */
export async function isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  try {
    const db = getAdminFirestore();
    const snapshot = await db.collection("posts").where("slug", "==", slug).get();
    return snapshot.docs.some((doc) => doc.id !== excludeId);
  } catch (error) {
    console.error("isSlugTaken failed:", error);
    return false;
  }
}
