import "server-only";

import { listInquiries } from "@/lib/inquiries/admin-data";
import { SESSION_TYPE_LABELS, type SessionType } from "@/lib/inquiries/types";

export type Client = {
  key: string;
  name: string;
  email: string;
  phone: string;
  inquiryCount: number;
  firstInquiryAt: string;
  lastInquiryAt: string;
  sessionTypes: SessionType[];
  inquiries: { id: string; createdAt: string; status: string }[];
};

export type ClientsResult = { configured: true; clients: Client[] } | { configured: false; clients: [] };

/**
 * A "client" is never its own Firestore document — it's derived, on
 * read, by grouping the existing `inquiries` collection by email (or
 * phone, if email is somehow blank). This project has exactly one real
 * relationship in its data (one enquiry, submitted by one family), so a
 * separate `clients` collection would only be a second copy of the same
 * name/email/phone that could drift out of sync with the inquiry it
 * came from — grouping at read time avoids that entirely, at the cost
 * of one full `inquiries` read per admin page view, which this
 * business's volume makes trivial.
 */
export async function deriveClients(): Promise<ClientsResult> {
  const result = await listInquiries();
  if (!result.configured) {
    return { configured: false, clients: [] };
  }

  const map = new Map<string, Client>();
  for (const inquiry of result.inquiries) {
    const key = (inquiry.customer.email || inquiry.customer.phone || inquiry.id).toLowerCase();
    const existing = map.get(key);
    if (existing) {
      existing.inquiryCount += 1;
      if (!existing.sessionTypes.includes(inquiry.session.type)) {
        existing.sessionTypes.push(inquiry.session.type);
      }
      existing.inquiries.push({ id: inquiry.id, createdAt: inquiry.createdAt, status: inquiry.status });
      if (inquiry.createdAt < existing.firstInquiryAt) existing.firstInquiryAt = inquiry.createdAt;
      if (inquiry.createdAt > existing.lastInquiryAt) existing.lastInquiryAt = inquiry.createdAt;
    } else {
      map.set(key, {
        key,
        name: inquiry.customer.name,
        email: inquiry.customer.email,
        phone: inquiry.customer.phone,
        inquiryCount: 1,
        firstInquiryAt: inquiry.createdAt,
        lastInquiryAt: inquiry.createdAt,
        sessionTypes: [inquiry.session.type],
        inquiries: [{ id: inquiry.id, createdAt: inquiry.createdAt, status: inquiry.status }],
      });
    }
  }

  const clients = Array.from(map.values()).sort((a, b) => b.lastInquiryAt.localeCompare(a.lastInquiryAt));
  return { configured: true, clients };
}

export function sessionTypeLabels(types: SessionType[]): string {
  return types.map((t) => SESSION_TYPE_LABELS[t]).join(", ");
}
