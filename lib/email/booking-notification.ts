import "server-only";

import { Resend } from "resend";

import { contactInfo } from "@/lib/data/contact";
import { SESSION_TYPE_LABELS, type Inquiry } from "@/lib/inquiries/types";
import { siteConfig } from "@/lib/seo/site";

export type EmailResult = { sent: true } | { sent: false; reason: "not_configured" | "send_failed" };

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

function buildEmailHtml(inquiry: Inquiry, adminUrl: string): string {
  const row = (label: string, value?: string | number) =>
    value === undefined || value === "" ? "" : `<tr><td style="padding:6px 12px;color:#746564;font-size:13px;">${label}</td><td style="padding:6px 12px;color:#2b2320;font-size:13px;">${escapeHtml(String(value))}</td></tr>`;

  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
      <h1 style="font-size:18px;color:#3d1f47;">New enquiry: ${escapeHtml(inquiry.customer.name)}</h1>
      <table style="width:100%;border-collapse:collapse;">
        ${row("Name", inquiry.customer.name)}
        ${row("Phone", inquiry.customer.phone)}
        ${row("Email", inquiry.customer.email)}
        ${row("Session type", SESSION_TYPE_LABELS[inquiry.session.type])}
        ${row("Package", inquiry.session.package)}
        ${row("Preferred date", inquiry.session.preferredDate)}
        ${row("Preferred time", inquiry.session.preferredTime)}
        ${row("Message", inquiry.message)}
        ${row("Consent to contact", inquiry.consent ? "Yes" : "No")}
        ${row("Submitted", new Date(inquiry.createdAt).toLocaleString())}
      </table>
      <p style="margin-top:20px;">
        <a href="${adminUrl}" style="background:#3d1f47;color:#fff;padding:10px 20px;text-decoration:none;border-radius:4px;font-size:13px;">
          View in Admin
        </a>
      </p>
    </div>
  `;
}

/**
 * Best-effort: emails the studio when a new booking enquiry is
 * submitted. Never blocks or fails the booking itself — this is called
 * only *after* the Firestore write already succeeded
 * (lib/inquiries/actions.ts#submitInquiry), and any failure here (missing
 * credentials, provider error) is caught and reported only via the
 * return value / server log, never surfaced to the customer. The booking
 * has already saved and is already visible in /admin/bookings/ by the
 * time this function is even called.
 */
export async function sendBookingNotificationEmail(inquiry: Inquiry): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { sent: false, reason: "not_configured" };
  }

  try {
    const resend = new Resend(apiKey);
    const adminUrl = new URL(`/admin/bookings/${inquiry.id}`, siteConfig.url).toString();

    const { error } = await resend.emails.send({
      // Resend's shared onboarding sender works without any domain setup
      // and is fine for this volume; switch to a verified custom domain
      // in the Resend dashboard later if desired, no code change needed
      // beyond this one address.
      from: "Newborn Photography Nepal <onboarding@resend.dev>",
      to: contactInfo.email,
      subject: `New enquiry: ${inquiry.customer.name} (${SESSION_TYPE_LABELS[inquiry.session.type]})`,
      html: buildEmailHtml(inquiry, adminUrl),
    });

    if (error) {
      console.error("sendBookingNotificationEmail: Resend returned an error:", error);
      return { sent: false, reason: "send_failed" };
    }
    return { sent: true };
  } catch (error) {
    console.error("sendBookingNotificationEmail failed:", error);
    return { sent: false, reason: "send_failed" };
  }
}
