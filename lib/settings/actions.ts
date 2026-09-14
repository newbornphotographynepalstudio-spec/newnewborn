"use server";

import { revalidatePath } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";

import { getAdminFirestore } from "@/lib/firebase/admin";
import { verifyAdminSession } from "@/lib/firebase/session";
import { auditActorFromSession, writeAuditLog } from "@/lib/audit/log";
import type { SocialLinkEntry } from "@/lib/settings/data";

export type SettingsFormState = { status: "idle" | "success" | "error"; message?: string };

const KNOWN_PLATFORMS: SocialLinkEntry["platform"][] = ["instagram", "facebook", "tiktok", "youtube", "pinterest"];

export async function saveSocialLinks(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await verifyAdminSession();
  if (!session) {
    return { status: "error", message: "Your session has expired. Please sign in again." };
  }

  const socialLinks: SocialLinkEntry[] = [];
  for (const platform of KNOWN_PLATFORMS) {
    const href = formData.get(`social_${platform}`);
    if (typeof href === "string" && href.trim().length > 0) {
      socialLinks.push({ platform, href: href.trim() });
    }
  }

  try {
    const db = getAdminFirestore();
    await db.collection("settings").doc("site").set({ socialLinks }, { merge: true });
    // Social links render in Footer(), which lives in app/(site)/layout.tsx
    // — every public route, not just "/". Found live in Phase 15: a real
    // save correctly updated the homepage (the old `revalidatePath(routes.home)`
    // covered that) but left every other page's footer stale, since a
    // plain page-path revalidation doesn't reach a shared layout. Same
    // fix already applied to saveGlobalSeo below for the same reason.
    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");
    await writeAuditLog({
      ...auditActorFromSession(session),
      action: "settings.social_links_updated",
      entityType: "settings",
      entityId: "site",
      details: `${socialLinks.length} link(s) set`,
    });
    return { status: "success", message: "Settings saved." };
  } catch (error) {
    console.error("saveSocialLinks failed:", error);
    return { status: "error", message: "Couldn't save settings. Please try again." };
  }
}

function readOptionalString(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/** Global SEO defaults — used by app/layout.tsx (via generateMetadata,
 * not the previous static `export const metadata`) for every page that
 * doesn't set its own title/description/OG image. Leaving a field blank
 * here means "use the original hardcoded siteConfig value", not "use
 * nothing" — see lib/seo/site.ts. `revalidatePath("/", "layout")`
 * (not the plain page form) is required here specifically because this
 * changes the *root layout's* metadata, which every route inherits. */
export async function saveGlobalSeo(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await verifyAdminSession();
  if (!session) {
    return { status: "error", message: "Your session has expired. Please sign in again." };
  }

  // `ignoreUndefinedProperties` (lib/firebase/admin.ts) makes the Admin
  // SDK silently strip any `undefined` value before it ever reaches
  // Firestore — so writing `{ seo: { siteName: undefined } }` with
  // `merge: true` does NOT clear a previously-set `siteName`, it just
  // omits that key from the write entirely, leaving the old value in
  // place. A genuinely blank field has to mean "clear this override, go
  // back to the default," so blank fields use `FieldValue.delete()`
  // instead — verified empirically that this must be a real *nested*
  // object matching the document shape (`{ seo: { siteName:
  // FieldValue.delete() } }`), not a flattened `"seo.siteName"` dot-path
  // key: the dot-path form silently no-ops on a `set(..., {merge:true})`
  // call (that flattened-key form is an `update()` idiom, not a `set()`
  // one) — this was actually caught live, not assumed, while testing
  // this exact restore path.
  const seo: Record<string, unknown> = {};
  for (const key of ["siteName", "tagline", "defaultDescription", "defaultOgImage", "organizationName"] as const) {
    const value = readOptionalString(formData, key);
    seo[key] = value === undefined ? FieldValue.delete() : value;
  }
  const update = { seo };

  try {
    const db = getAdminFirestore();
    await db.collection("settings").doc("site").set(update, { merge: true });
    revalidatePath("/", "layout");
    revalidatePath("/admin/seo");
    await writeAuditLog({
      ...auditActorFromSession(session),
      action: "settings.global_seo_updated",
      entityType: "settings",
      entityId: "site",
    });
    return { status: "success", message: "Global SEO saved." };
  } catch (error) {
    console.error("saveGlobalSeo failed:", error);
    return { status: "error", message: "Couldn't save. Please try again." };
  }
}
