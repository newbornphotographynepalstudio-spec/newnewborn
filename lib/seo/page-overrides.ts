import "server-only";

import { getAdminFirestore } from "@/lib/firebase/admin";

export type PageSeoOverride = {
  path: string;
  seoTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  noindex: boolean;
  nofollow: boolean;
  updatedAt: string;
};

/** Firestore doc IDs can't contain "/", so a route path becomes its
 * document id by stripping the leading/trailing slash and swapping
 * internal slashes for "--" — reversible enough for display purposes
 * (the real `path` field is always stored alongside, so nothing ever
 * depends on decoding the id itself). */
export function pathToDocId(path: string): string {
  return path.replace(/^\/|\/$/g, "").replace(/\//g, "--") || "home";
}

function toIso(value: unknown): string {
  if (value && typeof value === "object" && "toDate" in value) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  return new Date().toISOString();
}

function docToOverride(id: string, data: FirebaseFirestore.DocumentData): PageSeoOverride {
  return {
    path: data.path ?? id,
    seoTitle: data.seoTitle || undefined,
    metaDescription: data.metaDescription || undefined,
    canonicalUrl: data.canonicalUrl || undefined,
    ogTitle: data.ogTitle || undefined,
    ogDescription: data.ogDescription || undefined,
    ogImage: data.ogImage || undefined,
    twitterTitle: data.twitterTitle || undefined,
    twitterDescription: data.twitterDescription || undefined,
    twitterImage: data.twitterImage || undefined,
    noindex: data.noindex === true,
    nofollow: data.nofollow === true,
    updatedAt: toIso(data.updatedAt),
  };
}

/** Public read: one page's SEO override, if any. Every field is optional
 * — a page's own hardcoded metadata (title/description/etc, already
 * written for each static route) is always the fallback for anything
 * left blank here, so this can never produce an empty <title> or
 * description just because a partial override exists. */
export async function getPageSeoOverride(path: string): Promise<PageSeoOverride | null> {
  try {
    const db = getAdminFirestore();
    const doc = await db.collection("pageSeo").doc(pathToDocId(path)).get();
    if (!doc.exists) return null;
    return docToOverride(doc.id, doc.data()!);
  } catch (error) {
    console.error("getPageSeoOverride failed:", error);
    return null;
  }
}

export async function getPageSeoOverrideByDocId(docId: string): Promise<PageSeoOverride | null> {
  try {
    const db = getAdminFirestore();
    const doc = await db.collection("pageSeo").doc(docId).get();
    if (!doc.exists) return null;
    return docToOverride(doc.id, doc.data()!);
  } catch (error) {
    console.error("getPageSeoOverrideByDocId failed:", error);
    return null;
  }
}

export type PageSeoListResult = { configured: true; overrides: PageSeoOverride[] } | { configured: false; overrides: [] };

export async function listPageSeoOverrides(): Promise<PageSeoListResult> {
  try {
    const db = getAdminFirestore();
    const snapshot = await db.collection("pageSeo").get();
    const overrides = snapshot.docs
      .map((doc) => docToOverride(doc.id, doc.data()))
      .sort((a, b) => a.path.localeCompare(b.path));
    return { configured: true, overrides };
  } catch (error) {
    console.error("listPageSeoOverrides failed:", error);
    return { configured: false, overrides: [] };
  }
}
