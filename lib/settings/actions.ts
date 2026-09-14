"use server";

import { revalidatePath } from "next/cache";

import { getAdminFirestore } from "@/lib/firebase/admin";
import { verifyAdminSession } from "@/lib/firebase/session";
import { auditActorFromSession, writeAuditLog } from "@/lib/audit/log";
import { routes } from "@/lib/navigation/routes";
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
    revalidatePath(routes.home);
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
