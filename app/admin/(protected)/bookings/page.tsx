import type { Metadata } from "next";

import { BookingsTable } from "@/components/sections/admin/BookingsTable";
import { listInquiries } from "@/lib/inquiries/admin-data";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { BookingsIcon } from "@/components/admin/ui/icons";

export const metadata: Metadata = {
  title: "Bookings",
  robots: { index: false, follow: false },
};

export default async function AdminBookingsPage() {
  const result = await listInquiries();

  return (
    <div>
      <PageHeader title="Bookings & Inquiries" description="Every enquiry submitted through /book-a-session/, newest first." />

      {!result.configured ? (
        <EmptyState
          icon={<BookingsIcon width={28} height={28} />}
          title="Firebase Admin credentials aren't configured"
          description="Once FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY are set, real enquiries will appear here."
        />
      ) : result.inquiries.length === 0 ? (
        <EmptyState icon={<BookingsIcon width={28} height={28} />} title="No enquiries yet" />
      ) : (
        <BookingsTable inquiries={result.inquiries} />
      )}
    </div>
  );
}
