"use server";

import { revalidatePath } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";

import { getAdminFirestore } from "@/lib/firebase/admin";
import { verifyAdminSession } from "@/lib/firebase/session";
import {
  CONTACT_PREFERENCES,
  INQUIRY_STATUSES,
  SESSION_TYPES,
  type ContactPreference,
  type InquiryStatus,
  type SessionType,
} from "@/lib/inquiries/types";
import { verifyTurnstileToken } from "@/lib/security/turnstile";

export type SubmitInquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
};

function readString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readOptionalString(formData: FormData, key: string): string | undefined {
  const value = readString(formData, key);
  return value.length > 0 ? value : undefined;
}

/**
 * Public entry point for /book-a-session/. Validates on the server (never
 * trusts client-side validation alone), verifies Turnstile when
 * configured, then writes directly to Firestore via the Admin SDK — the
 * public Firebase client SDK is never used here, so firestore.rules'
 * public-create-only policy is a second layer of defense, not the only
 * one. If Firebase Admin credentials aren't configured yet (this
 * environment), this fails clearly instead of silently pretending to
 * succeed.
 */
export async function submitInquiry(
  _prevState: SubmitInquiryState,
  formData: FormData
): Promise<SubmitInquiryState> {
  const name = readString(formData, "name");
  const email = readString(formData, "email");
  const phone = readString(formData, "phone");
  const sessionTypeRaw = readString(formData, "sessionType");
  const consent = formData.get("consent") === "on";
  const turnstileToken = formData.get("cf-turnstile-response");

  if (!name || !email || !phone) {
    return { status: "error", message: "Please fill in your name, email and phone number." };
  }
  if (!SESSION_TYPES.includes(sessionTypeRaw as SessionType)) {
    return { status: "error", message: "Please choose a session type." };
  }
  if (!consent) {
    return { status: "error", message: "Please confirm you're okay with being contacted about your enquiry." };
  }

  const tokenValue = typeof turnstileToken === "string" ? turnstileToken : null;
  const humanVerified = await verifyTurnstileToken(tokenValue);
  if (!humanVerified) {
    return { status: "error", message: "We couldn't verify this submission. Please try again." };
  }

  const sessionType = sessionTypeRaw as SessionType;
  const contactPreferenceRaw = readString(formData, "contactPreference");
  const contactPreference: ContactPreference = CONTACT_PREFERENCES.includes(
    contactPreferenceRaw as ContactPreference
  )
    ? (contactPreferenceRaw as ContactPreference)
    : "phone";

  const familyMembersRaw = readOptionalString(formData, "familyMembers");
  const familyMembers = familyMembersRaw ? Number.parseInt(familyMembersRaw, 10) : undefined;

  try {
    const db = getAdminFirestore();
    await db.collection("inquiries").add({
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      customer: {
        name,
        email,
        phone,
        whatsapp: phone,
      },
      session: {
        type: sessionType,
        package: readOptionalString(formData, "package"),
        preferredDate: readOptionalString(formData, "preferredDate"),
        preferredTime: readOptionalString(formData, "preferredTime"),
        alternativeDate: readOptionalString(formData, "alternativeDate"),
      },
      baby: {
        name: readOptionalString(formData, "babyName"),
        dateOfBirth: readOptionalString(formData, "babyDob"),
        dueDate: readOptionalString(formData, "dueDate"),
      },
      familyMembers: Number.isFinite(familyMembers) ? familyMembers : undefined,
      message: readOptionalString(formData, "message"),
      contactPreference,
      consent,
      status: "new",
      source: "website",
    });

    return {
      status: "success",
      message: "Thank you. Your enquiry has been received.",
    };
  } catch (error) {
    console.error("submitInquiry failed:", error);
    return {
      status: "error",
      message:
        "We couldn't send your enquiry right now. Please don't worry, you can reach us directly on WhatsApp or by phone, and we'll help you arrange your session.",
    };
  }
}

export type UpdateStatusState = { status: "idle" | "success" | "error"; message?: string };

/**
 * Admin-only: updates one inquiry's status. Reachable through
 * /admin/bookings/[id]/, which sits behind requireAdminSession() in
 * app/admin/(protected)/layout.tsx — but a Server Action is its own
 * callable endpoint and isn't guaranteed to only ever be invoked from a
 * page that already checked, so it independently calls the same
 * cryptographic session check here rather than trusting the caller. This
 * action never accepts a client-supplied role — it only ever changes
 * `status` on one already-identified document.
 */
export async function updateInquiryStatus(
  _prevState: UpdateStatusState,
  formData: FormData
): Promise<UpdateStatusState> {
  const session = await verifyAdminSession();
  if (!session) {
    return { status: "error", message: "Your session has expired. Please sign in again." };
  }

  const id = readString(formData, "id");
  const nextStatus = readString(formData, "status");

  if (!id || !INQUIRY_STATUSES.includes(nextStatus as InquiryStatus)) {
    return { status: "error", message: "Invalid status update." };
  }

  try {
    const db = getAdminFirestore();
    await db.collection("inquiries").doc(id).update({
      status: nextStatus,
      updatedAt: FieldValue.serverTimestamp(),
    });
    revalidatePath(`/admin/bookings/${id}`);
    revalidatePath("/admin/bookings");
    return { status: "success", message: "Status updated." };
  } catch (error) {
    console.error("updateInquiryStatus failed:", error);
    return { status: "error", message: "Couldn't update the status. Please try again." };
  }
}
