import "server-only";

import { getAdminFirestore } from "@/lib/firebase/admin";
import { fullFaqList } from "@/lib/data/faq-full";
import { homeFaqPreview } from "@/lib/data/faq-preview";
import type { FaqItem } from "@/lib/faq/types";

function docToFaq(id: string, data: FirebaseFirestore.DocumentData): FaqItem {
  return { id, question: data.question, answer: data.answer };
}

/** Full FAQ list for /faq/. Falls back to the original hardcoded list if
 * Firestore is empty or unreachable — same honest-degradation pattern as
 * packages/posts. */
export async function getFaqs(): Promise<FaqItem[]> {
  try {
    const db = getAdminFirestore();
    const snapshot = await db.collection("faqs").orderBy("order", "asc").get();
    if (snapshot.empty) return fullFaqList;
    return snapshot.docs.map((doc) => docToFaq(doc.id, doc.data()));
  } catch (error) {
    console.error("getFaqs failed, falling back to static data:", error);
    return fullFaqList;
  }
}

/** The first 5 (homepage preview) — same ordering source as getFaqs(), so
 * the preview is always a true prefix of the full list, never a separate
 * hand-maintained set that can drift out of sync. */
export async function getFaqPreview(): Promise<FaqItem[]> {
  const all = await getFaqs();
  return all === fullFaqList ? homeFaqPreview : all.slice(0, 5);
}
