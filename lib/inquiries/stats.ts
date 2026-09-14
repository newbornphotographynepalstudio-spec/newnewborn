import "server-only";

import { getAdminFirestore } from "@/lib/firebase/admin";
import type { Inquiry } from "@/lib/inquiries/types";

export type InquiryStats = {
  configured: boolean;
  total: number;
  newCount: number;
  contactedCount: number;
  bookedCount: number;
  closedCount: number;
  dueFollowUpCount: number;
  recent: Inquiry[];
};

const EMPTY_STATS: InquiryStats = {
  configured: false,
  total: 0,
  newCount: 0,
  contactedCount: 0,
  bookedCount: 0,
  closedCount: 0,
  dueFollowUpCount: 0,
  recent: [],
};

/** Real counts for the admin dashboard — one Firestore read of the whole
 * collection. This studio's enquiry volume is small enough (a local
 * photography business, not a high-traffic SaaS) that this is simpler
 * and cheaper than maintaining separate aggregate counters. */
export async function getInquiryStats(): Promise<InquiryStats> {
  try {
    const db = getAdminFirestore();
    const snapshot = await db.collection("inquiries").orderBy("createdAt", "desc").get();

    const stats = { ...EMPTY_STATS, configured: true, total: snapshot.size };
    const recent: Inquiry[] = [];

    const today = new Date().toISOString().slice(0, 10);

    snapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      const status = data.status ?? "new";
      if (status === "new") stats.newCount += 1;
      else if (status === "contacted") stats.contactedCount += 1;
      else if (status === "booked") stats.bookedCount += 1;
      else if (status === "closed") stats.closedCount += 1;

      if (typeof data.followUpDate === "string" && data.followUpDate <= today) {
        stats.dueFollowUpCount += 1;
      }

      if (index < 5) {
        recent.push({
          id: doc.id,
          createdAt: toIso(data.createdAt),
          updatedAt: toIso(data.updatedAt),
          customer: data.customer ?? { name: "", email: "", phone: "" },
          session: data.session ?? { type: "newborn" },
          baby: data.baby ?? {},
          familyMembers: data.familyMembers,
          message: data.message,
          contactPreference: data.contactPreference ?? "phone",
          consent: data.consent ?? true,
          status: data.status ?? "new",
          source: data.source ?? "website",
          adminNotes: data.adminNotes,
          followUpDate: data.followUpDate,
        });
      }
    });

    return { ...stats, recent };
  } catch (error) {
    console.error("getInquiryStats failed (Firebase Admin not configured?):", error);
    return EMPTY_STATS;
  }
}

function toIso(value: unknown): string {
  if (value && typeof value === "object" && "toDate" in value) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  return new Date().toISOString();
}
