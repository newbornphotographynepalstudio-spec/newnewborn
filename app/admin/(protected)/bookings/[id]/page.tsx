import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { StatusUpdateForm } from "@/components/sections/admin/StatusUpdateForm";
import { getInquiry } from "@/lib/inquiries/admin-data";
import { SESSION_TYPE_LABELS } from "@/lib/inquiries/types";

export const metadata: Metadata = {
  title: "Booking Detail",
  robots: { index: false, follow: false },
};

function Field({ label, value }: { label: string; value?: string | number | null }) {
  if (!value) return null;
  return (
    <div className="border-b border-taupe/15 py-3">
      <p className="text-caption tracking-eyebrow text-taupe uppercase">{label}</p>
      <p className="mt-1 text-body text-charcoal">{value}</p>
    </div>
  );
}

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inquiry = await getInquiry(id);

  if (!inquiry) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-gutter py-2xl">
      <Link href="/admin/bookings" className="text-small text-plum hover:underline">
        ← All Bookings
      </Link>

      <h1 className="mt-4 text-h2 text-plum">{inquiry.customer.name}</h1>
      <p className="mt-1 text-small text-taupe">
        Submitted {new Date(inquiry.createdAt).toLocaleString()}
      </p>

      <div className="mt-8 border border-taupe/20 bg-white p-6">
        <StatusUpdateForm id={inquiry.id} currentStatus={inquiry.status} />
      </div>

      <div className="mt-8 border border-taupe/20 bg-white p-6">
        <h2 className="text-caption font-medium tracking-eyebrow text-taupe uppercase">Customer</h2>
        <Field label="Name" value={inquiry.customer.name} />
        <Field label="Email" value={inquiry.customer.email} />
        <Field label="Phone / WhatsApp" value={inquiry.customer.phone} />
        <Field label="Preferred Contact Method" value={inquiry.contactPreference} />
        <Field label="Consent to Contact" value={inquiry.consent ? "Yes" : "No"} />
      </div>

      <div className="mt-8 border border-taupe/20 bg-white p-6">
        <h2 className="text-caption font-medium tracking-eyebrow text-taupe uppercase">Session</h2>
        <Field label="Type" value={SESSION_TYPE_LABELS[inquiry.session.type]} />
        <Field label="Package" value={inquiry.session.package} />
        <Field label="Preferred Date" value={inquiry.session.preferredDate} />
        <Field label="Preferred Time" value={inquiry.session.preferredTime} />
        <Field label="Alternative Date" value={inquiry.session.alternativeDate} />
        <Field label="Family Members" value={inquiry.familyMembers} />
      </div>

      {(inquiry.baby.name || inquiry.baby.dateOfBirth || inquiry.baby.dueDate) ? (
        <div className="mt-8 border border-taupe/20 bg-white p-6">
          <h2 className="text-caption font-medium tracking-eyebrow text-taupe uppercase">Baby</h2>
          <Field label="Name" value={inquiry.baby.name} />
          <Field label="Date of Birth" value={inquiry.baby.dateOfBirth} />
          <Field label="Expected Due Date" value={inquiry.baby.dueDate} />
        </div>
      ) : null}

      {inquiry.message ? (
        <div className="mt-8 border border-taupe/20 bg-white p-6">
          <h2 className="text-caption font-medium tracking-eyebrow text-taupe uppercase">Message</h2>
          <p className="mt-3 text-body leading-relaxed text-charcoal/85">{inquiry.message}</p>
        </div>
      ) : null}
    </div>
  );
}
