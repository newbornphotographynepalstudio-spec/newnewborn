"use server";

import { revalidatePath } from "next/cache";

import { getAdminFirestore } from "@/lib/firebase/admin";
import { verifyAdminSession } from "@/lib/firebase/session";
import { auditActorFromSession, writeAuditLog } from "@/lib/audit/log";
import { routes } from "@/lib/navigation/routes";

export type FaqFormState = { status: "idle" | "success" | "error"; message?: string };

function readString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function revalidateFaqPaths() {
  revalidatePath(routes.faq);
  revalidatePath(routes.home);
  revalidatePath("/admin/faqs");
}

export async function saveFaq(_prevState: FaqFormState, formData: FormData): Promise<FaqFormState> {
  const session = await verifyAdminSession();
  if (!session) {
    return { status: "error", message: "Your session has expired. Please sign in again." };
  }

  const id = readString(formData, "id");
  const question = readString(formData, "question");
  const answer = readString(formData, "answer");
  const orderRaw = readString(formData, "order");
  const order = Number.parseInt(orderRaw, 10);

  if (!question || !answer) {
    return { status: "error", message: "Please fill in both the question and answer." };
  }

  const data = { question, answer, order: Number.isNaN(order) ? 0 : order };

  try {
    const db = getAdminFirestore();
    let faqId = id;
    if (id) {
      await db.collection("faqs").doc(id).set(data, { merge: true });
    } else {
      const ref = await db.collection("faqs").add(data);
      faqId = ref.id;
    }
    revalidateFaqPaths();
    await writeAuditLog({
      ...auditActorFromSession(session),
      action: id ? "faq.updated" : "faq.created",
      entityType: "faq",
      entityId: faqId,
      details: question,
    });
    return { status: "success", message: "FAQ saved." };
  } catch (error) {
    console.error("saveFaq failed:", error);
    return { status: "error", message: "Couldn't save. Please try again." };
  }
}

export async function deleteFaq(id: string): Promise<FaqFormState> {
  const session = await verifyAdminSession();
  if (!session) {
    return { status: "error", message: "Your session has expired. Please sign in again." };
  }
  try {
    const db = getAdminFirestore();
    await db.collection("faqs").doc(id).delete();
    revalidateFaqPaths();
    await writeAuditLog({
      ...auditActorFromSession(session),
      action: "faq.deleted",
      entityType: "faq",
      entityId: id,
    });
    return { status: "success", message: "Deleted." };
  } catch (error) {
    console.error("deleteFaq failed:", error);
    return { status: "error", message: "Couldn't delete. Please try again." };
  }
}
