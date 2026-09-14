import Link from "next/link";
import type { Metadata } from "next";

import { listInquiries } from "@/lib/inquiries/admin-data";
import { SESSION_TYPE_LABELS, STATUS_LABELS } from "@/lib/inquiries/types";

export const metadata: Metadata = {
  title: "Bookings",
  robots: { index: false, follow: false },
};

const statusToneClass: Record<string, string> = {
  new: "bg-blush text-plum",
  contacted: "bg-white text-charcoal border border-taupe/30",
  booked: "bg-plum text-white",
  closed: "bg-stone-soft text-taupe",
};

export default async function AdminBookingsPage() {
  const result = await listInquiries();

  return (
    <div className="mx-auto max-w-7xl px-gutter py-2xl">
      <h1 className="text-h2 text-plum">Bookings & Inquiries</h1>
      <p className="mt-2xs text-small text-charcoal/70">
        Every enquiry submitted through /book-a-session/, newest first.
      </p>

      {!result.configured ? (
        <div className="mt-lg border border-dashed border-taupe/40 bg-white p-lg text-small text-taupe">
          Firebase Admin credentials aren&apos;t configured in this
          environment yet, so inquiries can&apos;t be loaded. Once
          FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY
          are set (see docs/SETUP.md), real enquiries will appear here.
        </div>
      ) : result.inquiries.length === 0 ? (
        <div className="mt-lg border border-dashed border-taupe/40 bg-white p-lg text-small text-taupe">
          No enquiries yet.
        </div>
      ) : (
        <div className="mt-lg overflow-x-auto border border-taupe/20 bg-white">
          <table className="w-full min-w-[720px] text-left text-small">
            <thead className="border-b border-taupe/20 text-caption tracking-eyebrow text-taupe uppercase">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Session</th>
                <th className="px-4 py-3">Package</th>
                <th className="px-4 py-3">Preferred Date</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {result.inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="border-b border-taupe/10 last:border-b-0 hover:bg-blush/40">
                  <td className="px-4 py-3">
                    <Link href={`/admin/bookings/${inquiry.id}`} className="font-medium text-plum hover:underline">
                      {inquiry.customer.name || "-"}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-charcoal/80">
                    <div>{inquiry.customer.phone}</div>
                    <div className="text-caption text-taupe">{inquiry.customer.email}</div>
                  </td>
                  <td className="px-4 py-3 text-charcoal/80">{SESSION_TYPE_LABELS[inquiry.session.type]}</td>
                  <td className="px-4 py-3 text-charcoal/80">{inquiry.session.package || "-"}</td>
                  <td className="px-4 py-3 text-charcoal/80">{inquiry.session.preferredDate || "-"}</td>
                  <td className="px-4 py-3 text-charcoal/60">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-sm px-2 py-1 text-caption font-medium uppercase ${statusToneClass[inquiry.status]}`}
                    >
                      {STATUS_LABELS[inquiry.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
