import "server-only";

import { getAdminFirestore } from "@/lib/firebase/admin";

export type SocialLinkEntry = {
  platform: "instagram" | "facebook" | "tiktok" | "youtube" | "pinterest";
  href: string;
};

export type GlobalSeoSettings = {
  siteName?: string;
  tagline?: string;
  defaultDescription?: string;
  defaultOgImage?: string;
  organizationName?: string;
};

export type SiteSettings = {
  socialLinks: SocialLinkEntry[];
  seo: GlobalSeoSettings;
};

const EMPTY_SETTINGS: SiteSettings = { socialLinks: [], seo: {} };

const KNOWN_PLATFORMS = new Set(["instagram", "facebook", "tiktok", "youtube", "pinterest"]);

/** Public read: the single `settings/site` document. Falls back to an
 * empty settings object (matching this codebase's existing pattern of
 * "no social links configured yet" rendering nothing, never a broken
 * empty icon) whenever Firestore is unreachable or the document doesn't
 * exist yet. Every `seo.*` field is optional and callers (currently
 * app/layout.tsx) fall back to the original hardcoded siteConfig value
 * for any field left blank — an admin can override one field (say, the
 * default description) without having to also re-enter everything else. */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const db = getAdminFirestore();
    const doc = await db.collection("settings").doc("site").get();
    if (!doc.exists) return EMPTY_SETTINGS;
    const data = doc.data()!;
    const socialLinks = Array.isArray(data.socialLinks)
      ? data.socialLinks.filter(
          (link): link is SocialLinkEntry =>
            typeof link?.href === "string" && link.href.length > 0 && KNOWN_PLATFORMS.has(link?.platform)
        )
      : [];
    const seo: GlobalSeoSettings = {
      siteName: typeof data.seo?.siteName === "string" ? data.seo.siteName : undefined,
      tagline: typeof data.seo?.tagline === "string" ? data.seo.tagline : undefined,
      defaultDescription: typeof data.seo?.defaultDescription === "string" ? data.seo.defaultDescription : undefined,
      defaultOgImage: typeof data.seo?.defaultOgImage === "string" ? data.seo.defaultOgImage : undefined,
      organizationName: typeof data.seo?.organizationName === "string" ? data.seo.organizationName : undefined,
    };
    return { socialLinks, seo };
  } catch (error) {
    console.error("getSiteSettings failed, falling back to empty settings:", error);
    return EMPTY_SETTINGS;
  }
}
