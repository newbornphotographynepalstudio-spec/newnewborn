import "server-only";

import type { Timestamp } from "firebase-admin/firestore";

import { getAdminFirestore } from "@/lib/firebase/admin";
import type { Inquiry } from "@/lib/inquiries/types";

export type InquiryListResult =
  | { configured: true; inquiries: Inquiry[] }
  | { configured: false; inquiries: [] };

function toIso(value: unknown): string {
  if (value && typeof value === "object" && "toDate" in value) {
    return (value as Timestamp).toDate().toISOString();
  }
  return new Date().toISOString();
}

/**
 * Server-only reads for the admin inbox — never exposed to the public
 * client SDK (see firestore.rules: public may create, never read).
 * Returns `configured: false` instead of throwing when Firebase Admin
 * credentials aren't set, so the admin page can show a clear "not
 * connected yet" state instead of a hard crash.
 */
export async function listInquiries(): Promise<InquiryListResult> {
  try {
    const db = getAdminFirestore();
    const snapshot = await db.collection("inquiries").orderBy("createdAt", "desc").get();
    const inquiries: Inquiry[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        createdAt: toIso(data.createdAt),
        updatedAt: toIso(data.updatedAt),
        customer: data.customer ?? { name: "", email: "", phone: "" },
        session: data.session ?? { type: "newborn" },
        baby: data.baby ?? {},
        familyMembers: data.familyMembers,
        message: data.message,
        contactPreference: data.contactPreference ?? "phone",
        // Records written before `consent` was stored explicitly can
        // only exist because the same consent-required check already
        // passed at submission time — default true, not invented.
        consent: data.consent ?? true,
        status: data.status ?? "new",
        source: data.source ?? "website",
        adminNotes: data.adminNotes,
        followUpDate: data.followUpDate,
      };
    });
    return { configured: true, inquiries };
  } catch (error) {
    console.error("listInquiries failed (Firebase Admin not configured?):", error);
    return { configured: false, inquiries: [] };
  }
}

export async function getInquiry(id: string): Promise<Inquiry | null> {
  try {
    const db = getAdminFirestore();
    const doc = await db.collection("inquiries").doc(id).get();
    if (!doc.exists) return null;
    const data = doc.data()!;
    return {
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
    };
  } catch (error) {
    console.error("getInquiry failed (Firebase Admin not configured?):", error);
    return null;
  }
}
