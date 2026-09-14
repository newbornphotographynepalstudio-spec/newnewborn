"use server";

import { revalidatePath } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";

import { getAdminFirestore } from "@/lib/firebase/admin";
import { verifyAdminSession } from "@/lib/firebase/session";
import { auditActorFromSession, writeAuditLog } from "@/lib/audit/log";
import { pathToDocId } from "@/lib/seo/page-overrides";

export type PageSeoFormState = { status: "idle" | "success" | "error"; message?: string };

function readOptionalString(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizePath(input: string): string {
  const trimmed = input.trim();
  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

export async function savePageSeoOverride(
  _prevState: PageSeoFormState,
  formData: FormData
): Promise<PageSeoFormState> {
  const session = await verifyAdminSession();
  if (!session) {
    return { status: "error", message: "Your session has expired. Please sign in again." };
  }

  const pathInput = readOptionalString(formData, "path");
  if (!pathInput) {
    return { status: "error", message: "A page path is required, e.g. /about/." };
  }
  const path = normalizePath(pathInput);

  // `ignoreUndefinedProperties` (lib/firebase/admin.ts) strips any
  // `undefined` value before it reaches Firestore, so writing
  // `undefined` for a blank field with `merge: true` would silently
  // leave a *previous* value in place instead of clearing it —
  // `FieldValue.delete()` is what actually clears a field on a merge
  // write.
  const optionalFields = [
    "seoTitle",
    "metaDescription",
    "canonicalUrl",
    "ogTitle",
    "ogDescription",
    "ogImage",
    "twitterTitle",
    "twitterDescription",
    "twitterImage",
  ] as const;
  const data: Record<string, unknown> = {
    path,
    noindex: formData.get("noindex") === "on",
    nofollow: formData.get("nofollow") === "on",
    updatedAt: new Date(),
  };
  for (const field of optionalFields) {
    const value = readOptionalString(formData, field);
    data[field] = value === undefined ? FieldValue.delete() : value;
  }

  try {
    const db = getAdminFirestore();
    await db.collection("pageSeo").doc(pathToDocId(path)).set(data, { merge: true });
    revalidatePath(path);
    revalidatePath("/admin/seo");
    await writeAuditLog({
      ...auditActorFromSession(session),
      action: "pageSeo.updated",
      entityType: "pageSeo",
      entityId: pathToDocId(path),
      details: path,
    });
    return { status: "success", message: "Saved." };
  } catch (error) {
    console.error("savePageSeoOverride failed:", error);
    return { status: "error", message: "Couldn't save. Please try again." };
  }
}

export async function deletePageSeoOverride(docId: string, path: string): Promise<PageSeoFormState> {
  const session = await verifyAdminSession();
  if (!session) {
    return { status: "error", message: "Your session has expired. Please sign in again." };
  }
  try {
    const db = getAdminFirestore();
    await db.collection("pageSeo").doc(docId).delete();
    revalidatePath(path);
    revalidatePath("/admin/seo");
    await writeAuditLog({
      ...auditActorFromSession(session),
      action: "pageSeo.deleted",
      entityType: "pageSeo",
      entityId: docId,
      details: path,
    });
    return { status: "success", message: "Deleted." };
  } catch (error) {
    console.error("deletePageSeoOverride failed:", error);
    return { status: "error", message: "Couldn't delete. Please try again." };
  }
}
