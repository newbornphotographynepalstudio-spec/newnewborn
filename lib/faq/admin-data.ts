import "server-only";

import { getAdminFirestore } from "@/lib/firebase/admin";

export type AdminFaqItem = { id: string; question: string; answer: string; order: number };

export type FaqListResult = { configured: true; faqs: AdminFaqItem[] } | { configured: false; faqs: [] };

export async function listFaqsAdmin(): Promise<FaqListResult> {
  try {
    const db = getAdminFirestore();
    const snapshot = await db.collection("faqs").orderBy("order", "asc").get();
    const faqs = snapshot.docs.map((doc) => ({
      id: doc.id,
      question: doc.data().question,
      answer: doc.data().answer,
      order: typeof doc.data().order === "number" ? doc.data().order : 0,
    }));
    return { configured: true, faqs };
  } catch (error) {
    console.error("listFaqsAdmin failed (Firebase Admin not configured?):", error);
    return { configured: false, faqs: [] };
  }
}

export async function getFaqAdmin(id: string): Promise<AdminFaqItem | null> {
  try {
    const db = getAdminFirestore();
    const doc = await db.collection("faqs").doc(id).get();
    if (!doc.exists) return null;
    const data = doc.data()!;
    return { id: doc.id, question: data.question, answer: data.answer, order: typeof data.order === "number" ? data.order : 0 };
  } catch (error) {
    console.error("getFaqAdmin failed:", error);
    return null;
  }
}
