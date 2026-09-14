import "server-only";

import { getAdminFirestore } from "@/lib/firebase/admin";

export type SocialLinkEntry = {
  platform: "instagram" | "facebook" | "tiktok" | "youtube" | "pinterest";
  href: string;
};

export type SiteSettings = {
  socialLinks: SocialLinkEntry[];
};

const EMPTY_SETTINGS: SiteSettings = { socialLinks: [] };

const KNOWN_PLATFORMS = new Set(["instagram", "facebook", "tiktok", "youtube", "pinterest"]);

/** Public read: the single `settings/site` document. Falls back to an
 * empty settings object (matching this codebase's existing pattern of
 * "no social links configured yet" rendering nothing, never a broken
 * empty icon) whenever Firestore is unreachable or the document doesn't
 * exist yet. */
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
    return { socialLinks };
  } catch (error) {
    console.error("getSiteSettings failed, falling back to empty settings:", error);
    return EMPTY_SETTINGS;
  }
}
