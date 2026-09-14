"use server";

import { revalidatePath } from "next/cache";

import { getAdminFirestore, getAdminStorage } from "@/lib/firebase/admin";
import { verifyAdminSession } from "@/lib/firebase/session";
import { auditActorFromSession, writeAuditLog } from "@/lib/audit/log";
import { MEDIA_CATEGORIES, type MediaLibraryCategory } from "@/lib/media/library-types";

export type MediaFormState = { status: "idle" | "success" | "error"; message?: string };

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024; // 20MB — generous for a web-ready export, well under a raw camera original.
const ALLOWED_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp"];

function readString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function slugifyFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function uploadMedia(_prevState: MediaFormState, formData: FormData): Promise<MediaFormState> {
  const session = await verifyAdminSession();
  if (!session) {
    return { status: "error", message: "Your session has expired. Please sign in again." };
  }

  const file = formData.get("file");
  const title = readString(formData, "title");
  const alt = readString(formData, "alt");
  const categoryRaw = readString(formData, "category");
  const category = (MEDIA_CATEGORIES as readonly string[]).includes(categoryRaw)
    ? (categoryRaw as MediaLibraryCategory)
    : "other";

  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Please choose an image file." };
  }
  if (!alt) {
    return { status: "error", message: "Please add factual alt text describing the photo." };
  }
  if (!ALLOWED_CONTENT_TYPES.includes(file.type)) {
    return { status: "error", message: "Please upload a JPEG, PNG or WebP image." };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return {
      status: "error",
      message: "That file is larger than 20MB. Please export a web-ready version rather than the raw camera original.",
    };
  }

  try {
    const bucket = getAdminStorage().bucket();
    const storagePath = `media/${category}/${Date.now()}-${slugifyFilename(file.name) || "photo"}.${file.type.split("/")[1]}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const storageFile = bucket.file(storagePath);
    await storageFile.save(buffer, { contentType: file.type, resumable: false });

    const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(storagePath)}?alt=media`;

    const db = getAdminFirestore();
    const ref = await db.collection("media").add({
      storagePath,
      url,
      title: title || file.name,
      alt,
      category,
      featured: false,
      published: true,
      order: 0,
      contentType: file.type,
      sizeBytes: file.size,
      createdAt: new Date(),
    });

    revalidatePath("/admin/media");
    await writeAuditLog({
      ...auditActorFromSession(session),
      action: "media.uploaded",
      entityType: "media",
      entityId: ref.id,
      details: `"${title || file.name}" (${category}, ${(file.size / 1024).toFixed(0)}KB)`,
    });

    return { status: "success", message: "Uploaded." };
  } catch (error) {
    console.error("uploadMedia failed:", error);
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("bucket does not exist") || message.includes("404")) {
      return {
        status: "error",
        message: "Firebase Storage isn't enabled on this project yet. See Site Settings for the exact setup step.",
      };
    }
    return { status: "error", message: "Couldn't upload the photo. Please try again." };
  }
}

export async function updateMediaMetadata(_prevState: MediaFormState, formData: FormData): Promise<MediaFormState> {
  const session = await verifyAdminSession();
  if (!session) {
    return { status: "error", message: "Your session has expired. Please sign in again." };
  }

  const id = readString(formData, "id");
  const title = readString(formData, "title");
  const alt = readString(formData, "alt");
  const categoryRaw = readString(formData, "category");
  const category = (MEDIA_CATEGORIES as readonly string[]).includes(categoryRaw)
    ? (categoryRaw as MediaLibraryCategory)
    : "other";
  const featured = formData.get("featured") === "on";
  const published = formData.get("published") === "on";
  const orderRaw = readString(formData, "order");
  const order = Number.parseInt(orderRaw, 10);

  if (!id || !alt) {
    return { status: "error", message: "Alt text is required." };
  }

  try {
    const db = getAdminFirestore();
    await db.collection("media").doc(id).update({
      title,
      alt,
      category,
      featured,
      published,
      order: Number.isNaN(order) ? 0 : order,
    });
    revalidatePath("/admin/media");
    await writeAuditLog({
      ...auditActorFromSession(session),
      action: "media.updated",
      entityType: "media",
      entityId: id,
    });
    return { status: "success", message: "Saved." };
  } catch (error) {
    console.error("updateMediaMetadata failed:", error);
    return { status: "error", message: "Couldn't save. Please try again." };
  }
}

export async function deleteMedia(id: string): Promise<MediaFormState> {
  const session = await verifyAdminSession();
  if (!session) {
    return { status: "error", message: "Your session has expired. Please sign in again." };
  }
  try {
    const db = getAdminFirestore();
    const doc = await db.collection("media").doc(id).get();
    if (!doc.exists) {
      return { status: "error", message: "Not found." };
    }
    const storagePath = doc.data()?.storagePath;
    if (storagePath) {
      await getAdminStorage().bucket().file(storagePath).delete().catch(() => {});
    }
    await doc.ref.delete();
    revalidatePath("/admin/media");
    await writeAuditLog({
      ...auditActorFromSession(session),
      action: "media.deleted",
      entityType: "media",
      entityId: id,
    });
    return { status: "success", message: "Deleted." };
  } catch (error) {
    console.error("deleteMedia failed:", error);
    return { status: "error", message: "Couldn't delete. Please try again." };
  }
}
