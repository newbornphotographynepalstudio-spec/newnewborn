"use server";

import { revalidatePath } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";

import { getAdminFirestore } from "@/lib/firebase/admin";
import { verifyAdminSession } from "@/lib/firebase/session";
import { auditActorFromSession, writeAuditLog } from "@/lib/audit/log";
import { getImageDimensions } from "@/lib/media/image-dimensions";
import { MEDIA_CATEGORIES, type MediaLibraryCategory } from "@/lib/media/library-types";
import { getSupabaseAdmin, isSupabaseConfigured, MEDIA_BUCKET } from "@/lib/supabase/admin";
import { portfolioCategories } from "@/lib/data/portfolio";
import { routes } from "@/lib/navigation/routes";

/** Media only reaches the public site through a category's portfolio
 * page or the homepage's Featured Work section — neither is revalidated
 * by Next.js automatically on a Firestore/Storage write, so every
 * mutation here must name the specific public paths it could affect. */
function revalidatePublicMediaPaths(category: MediaLibraryCategory, featuredMayHaveChanged: boolean) {
  const categoryPage = portfolioCategories.find((c) => c.slug === category);
  if (categoryPage) {
    revalidatePath(categoryPage.href);
  }
  if (featuredMayHaveChanged) {
    revalidatePath(routes.home);
  }
}

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

/**
 * Turns a real Supabase Storage / Firestore error into a specific but
 * safe admin-facing message — never the raw error (which can include
 * internal endpoint/table details), never a secret, but specific enough
 * to actually act on instead of the one generic "Couldn't upload" string
 * every failure used to collapse into. Matched by message substring
 * rather than error class, since @supabase/supabase-js's StorageError
 * and firebase-admin's Firestore errors are both plain-shaped enough
 * that this is more robust than an instanceof check across two SDKs.
 */
function describeUploadError(error: unknown, fileName: string): string {
  const message = error instanceof Error ? error.message : String(error);
  const lower = message.toLowerCase();

  if (lower.includes("bucket not found") || lower.includes("resource_not_found")) {
    return `"${fileName}": the photo storage bucket isn't set up correctly. Contact the developer.`;
  }
  if (
    lower.includes("row-level security") ||
    lower.includes("row level security") ||
    lower.includes("permission") ||
    lower.includes("unauthorized") ||
    lower.includes("not allowed")
  ) {
    return `"${fileName}": photo storage refused this upload (a permissions issue on the storage side). Contact the developer.`;
  }
  if (lower.includes("payload too large") || lower.includes("exceeded the maximum allowed size")) {
    return `"${fileName}": this file is too large for photo storage to accept.`;
  }
  if (lower.includes("already exists") || lower.includes("duplicate")) {
    return `"${fileName}": a file with this name already exists in storage. Try again — a new upload gets a unique name automatically.`;
  }
  if (lower.includes("fetch failed") || lower.includes("network") || lower.includes("timeout") || lower.includes("timed out")) {
    return `"${fileName}": couldn't reach photo storage (a network issue). Please try again.`;
  }
  if (lower.includes("firestore") || lower.includes("deadline_exceeded") || lower.includes("unavailable")) {
    return `"${fileName}": the photo uploaded, but saving its details failed. Please try again or contact the developer.`;
  }
  return `"${fileName}": upload failed unexpectedly. Please try again. If the problem continues, contact the developer.`;
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

  // Everything past this point talks to Supabase Storage and Firestore —
  // wrapped in its own try/catch (rather than relying solely on the
  // caller's) so one file's real storage/database error becomes this
  // file's own `{ok:false}` result instead of an uncaught throw that
  // would abort every other file in the same batch (when run in
  // parallel — see uploadMedia) or surface to the browser as the
  // generic unhandled-error page instead of this form's own inline
  // message (see describeUploadError above).
  try {
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
  } catch (error) {
    console.error(`uploadOneFile failed for "${file.name}":`, error);
    return { ok: false, message: describeUploadError(error, file.name) };
  }
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
    // Run every file's upload concurrently rather than one at a time —
    // found live: a small 6-photo batch of ordinary export sizes took
    // over 12 seconds processed sequentially (upload, then a Firestore
    // write, per file, one after another), comfortably past Vercel's
    // default 10s Hobby-plan function limit for a request that size.
    // uploadOneFile already catches its own errors (never throws), so
    // one bad file can't cancel the others the way Promise.all normally
    // would on a rejection.
    const results = await Promise.all(
      files.map((file) => uploadOneFile(file, category, files.length === 1 ? title : "", alt, caption))
    );
    for (const result of results) {
      if (result.ok) {
        uploadedCount += 1;
        uploadedIds.push(result.id);
      } else {
        errors.push(result.message);
      }
    }

    revalidatePath("/admin/media");
    if (uploadedCount > 0) {
      // New uploads are always featured:false, so Featured Work can't
      // have changed — only the category page needs revalidating.
      revalidatePublicMediaPaths(category, false);
    }
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
    // uploadOneFile no longer throws (it catches its own errors above),
    // so reaching this block means something outside any single file's
    // upload failed — e.g. revalidation or the audit log write. Still
    // categorized rather than a single blanket message, on the same
    // reasoning as describeUploadError.
    console.error("uploadMedia failed:", error);
    return { status: "error", message: describeUploadError(error, "upload") };
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
    const docRef = db.collection("media").doc(id);
    const before = await docRef.get();
    const previousCategory = before.data()?.category as MediaLibraryCategory | undefined;

    await docRef.update({
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
    // featured/published could have changed either way, so always
    // revalidate Featured Work; revalidate both category pages if the
    // photo moved categories.
    revalidatePublicMediaPaths(category, true);
    if (previousCategory && previousCategory !== category) {
      revalidatePublicMediaPaths(previousCategory, false);
    }
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
    const data = doc.data();
    const storagePath = data?.storagePath;
    if (storagePath && isSupabaseConfigured()) {
      await getSupabaseAdmin().storage.from(MEDIA_BUCKET).remove([storagePath]);
    }
    await doc.ref.delete();
    revalidatePath("/admin/media");
    const category = data?.category as MediaLibraryCategory | undefined;
    if (category) {
      // A deleted photo may have been featured, so revalidate the
      // homepage too, not just its category page.
      revalidatePublicMediaPaths(category, true);
    }
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
