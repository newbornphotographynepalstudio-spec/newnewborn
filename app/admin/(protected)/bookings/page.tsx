import type { Metadata } from "next";

import { BookingsTable } from "@/components/sections/admin/BookingsTable";
import { listInquiries } from "@/lib/inquiries/admin-data";

export const metadata: Metadata = {
  title: "Bookings",
  robots: { index: false, follow: false },
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
        <BookingsTable inquiries={result.inquiries} />
      )}
    </div>
  );
}
