"use server";

import { revalidatePath } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";

import { getAdminFirestore } from "@/lib/firebase/admin";
import { verifyAdminSession } from "@/lib/firebase/session";
import { auditActorFromSession, writeAuditLog } from "@/lib/audit/log";
import { getImageDimensions } from "@/lib/media/image-dimensions";
import { MEDIA_CATEGORIES, type MediaLibraryCategory } from "@/lib/media/library-types";
import { getSupabaseAdmin, isSupabaseConfigured, MEDIA_BUCKET } from "@/lib/supabase/admin";

export type MediaFormState = { status: "idle" | "success" | "error"; message?: string; uploadedCount?: number };

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
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

async function uploadOneFile(
  file: File,
  category: MediaLibraryCategory,
  titleOverride: string,
  alt: string,
  caption: string
): Promise<{ ok: true; id: string; sizeBytes: number } | { ok: false; message: string }> {
  if (file.size === 0) return { ok: false, message: `"${file.name}": empty file.` };
  if (!ALLOWED_CONTENT_TYPES.includes(file.type)) {
    return { ok: false, message: `"${file.name}": please upload a JPEG, PNG or WebP image.` };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return {
      ok: false,
      message: `"${file.name}" is larger than 20MB. Please export a web-ready version rather than the raw camera original.`,
    };
  }

  const extension = file.type.split("/")[1];
  const storagePath = `${category}/${Date.now()}-${slugifyFilename(file.name) || "photo"}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const supabase = getSupabaseAdmin();
  const { error: uploadError } = await supabase.storage.from(MEDIA_BUCKET).upload(storagePath, buffer, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) {
    throw uploadError;
  }

  const { data: publicUrlData } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(storagePath);
  const dimensions = getImageDimensions(buffer, file.type);

  const db = getAdminFirestore();
  const ref = await db.collection("media").add({
    storagePath,
    url: publicUrlData.publicUrl,
    title: titleOverride || file.name,
    alt,
    caption: caption || undefined,
    category,
    featured: false,
    published: true,
    order: 0,
    contentType: file.type,
    sizeBytes: file.size,
    width: dimensions?.width,
    height: dimensions?.height,
    createdAt: new Date(),
  });

  return { ok: true, id: ref.id, sizeBytes: file.size };
}

/** Uploads one or more photos to Supabase Storage (this project stays on
 * the Firebase Spark plan, which doesn't include Firebase Storage;
 * Firestore/Auth remain entirely on Firebase — see lib/supabase/admin.ts).
 * Accepts multiple files under the same "files" field name. */
export async function uploadMedia(_prevState: MediaFormState, formData: FormData): Promise<MediaFormState> {
  const session = await verifyAdminSession();
  if (!session) {
    return { status: "error", message: "Your session has expired. Please sign in again." };
  }

  if (!isSupabaseConfigured()) {
    return {
      status: "error",
      message: "Photo storage isn't configured yet. See Site Settings for what's needed.",
    };
  }

  const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  const title = readString(formData, "title");
  const alt = readString(formData, "alt");
  const caption = readString(formData, "caption");
  const categoryRaw = readString(formData, "category");
  const category = (MEDIA_CATEGORIES as readonly string[]).includes(categoryRaw)
    ? (categoryRaw as MediaLibraryCategory)
    : "other";

  if (files.length === 0) {
    return { status: "error", message: "Please choose at least one image file." };
  }
  if (!alt) {
    return { status: "error", message: "Please add factual alt text describing the photo." };
  }

  const errors: string[] = [];
  let uploadedCount = 0;
  const uploadedIds: string[] = [];

  try {
    for (const file of files) {
      const result = await uploadOneFile(file, category, files.length === 1 ? title : "", alt, caption);
      if (result.ok) {
        uploadedCount += 1;
        uploadedIds.push(result.id);
      } else {
        errors.push(result.message);
      }
    }

    revalidatePath("/admin/media");
    if (uploadedIds.length > 0) {
      await writeAuditLog({
        ...auditActorFromSession(session),
        action: "media.uploaded",
        entityType: "media",
        entityId: uploadedIds[0],
        details: `${uploadedIds.length} photo(s) uploaded to "${category}"${uploadedIds.length > 1 ? ` (ids: ${uploadedIds.join(", ")})` : ""}`,
      });
    }

    if (errors.length > 0 && uploadedCount === 0) {
      return { status: "error", message: errors.join(" ") };
    }
    if (errors.length > 0) {
      return { status: "success", message: `Uploaded ${uploadedCount}. Skipped: ${errors.join(" ")}`, uploadedCount };
    }
    return { status: "success", message: `Uploaded ${uploadedCount} photo${uploadedCount > 1 ? "s" : ""}.`, uploadedCount };
  } catch (error) {
    console.error("uploadMedia failed:", error);
    return { status: "error", message: "Couldn't upload. Please try again." };
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
  const caption = readString(formData, "caption");
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
      // FieldValue.delete() (not `undefined`, which ignoreUndefinedProperties
      // strips before Firestore sees it) so blanking the caption on an
      // existing photo actually clears it, rather than leaving the
      // previous value in place.
      caption: caption || FieldValue.delete(),
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
    if (storagePath && isSupabaseConfigured()) {
      await getSupabaseAdmin().storage.from(MEDIA_BUCKET).remove([storagePath]);
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
