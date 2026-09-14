"use server";

import { revalidatePath } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";

import { getAdminFirestore } from "@/lib/firebase/admin";
import { verifyAdminSession } from "@/lib/firebase/session";
import { auditActorFromSession, writeAuditLog } from "@/lib/audit/log";
import { isSlugTaken } from "@/lib/blog/admin-data";
import { DEFAULT_AUTHOR } from "@/lib/blog/types";
import { routes } from "@/lib/navigation/routes";

export type PostFormState = { status: "idle" | "success" | "error"; message?: string; postId?: string };

function readString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function revalidateBlogPaths(slug?: string) {
  revalidatePath(routes.blog);
  revalidatePath("/admin/blog");
  if (slug) revalidatePath(`${routes.blog}${slug}`);
}

export async function savePost(_prevState: PostFormState, formData: FormData): Promise<PostFormState> {
  const session = await verifyAdminSession();
  if (!session) {
    return { status: "error", message: "Your session has expired. Please sign in again." };
  }

  const id = readString(formData, "id");
  const title = readString(formData, "title");
  const slugInput = readString(formData, "slug");
  const excerpt = readString(formData, "excerpt");
  const content = readString(formData, "content");
  const author = readString(formData, "author") || DEFAULT_AUTHOR;
  const status = readString(formData, "status") === "published" ? "published" : "draft";
  const seoTitle = readString(formData, "seoTitle");
  const seoDescription = readString(formData, "seoDescription");
  const featuredImageId = readString(formData, "featuredImageId");

  if (!title || !content) {
    return { status: "error", message: "Please fill in a title and content." };
  }

  const slug = slugify(slugInput || title);
  if (!slug) {
    return { status: "error", message: "Couldn't generate a valid URL slug from that title." };
  }

  const taken = await isSlugTaken(slug, id || undefined);
  if (taken) {
    return { status: "error", message: `The slug "${slug}" is already used by another post.` };
  }

  const data: Record<string, unknown> = {
    title,
    slug,
    excerpt,
    content,
    author,
    status,
    // FieldValue.delete() (not `undefined`, which ignoreUndefinedProperties
    // strips before Firestore ever sees it) so blanking one of these
    // fields on an existing post actually clears it on this merge write,
    // rather than silently leaving the previous value in place.
    seoTitle: seoTitle || FieldValue.delete(),
    seoDescription: seoDescription || FieldValue.delete(),
    featuredImageId: featuredImageId || FieldValue.delete(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  try {
    const db = getAdminFirestore();
    let postId = id;
    if (id) {
      const existing = await db.collection("posts").doc(id).get();
      const wasPublished = existing.exists && existing.data()?.status === "published";
      if (status === "published" && !wasPublished) {
        data.publishedAt = FieldValue.serverTimestamp();
      }
      await db.collection("posts").doc(id).set(data, { merge: true });
    } else {
      data.createdAt = FieldValue.serverTimestamp();
      if (status === "published") data.publishedAt = FieldValue.serverTimestamp();
      const ref = await db.collection("posts").add(data);
      postId = ref.id;
    }
    revalidateBlogPaths(slug);
    await writeAuditLog({
      ...auditActorFromSession(session),
      action: id ? "post.updated" : "post.created",
      entityType: "post",
      entityId: postId,
      details: `"${title}" (${status})`,
    });
    return { status: "success", message: "Post saved.", postId };
  } catch (error) {
    console.error("savePost failed:", error);
    return { status: "error", message: "Couldn't save the post. Please try again." };
  }
}

export async function deletePost(id: string): Promise<PostFormState> {
  const session = await verifyAdminSession();
  if (!session) {
    return { status: "error", message: "Your session has expired. Please sign in again." };
  }
  try {
    const db = getAdminFirestore();
    await db.collection("posts").doc(id).delete();
    revalidateBlogPaths();
    await writeAuditLog({
      ...auditActorFromSession(session),
      action: "post.deleted",
      entityType: "post",
      entityId: id,
    });
    return { status: "success", message: "Post deleted." };
  } catch (error) {
    console.error("deletePost failed:", error);
    return { status: "error", message: "Couldn't delete the post. Please try again." };
  }
}
