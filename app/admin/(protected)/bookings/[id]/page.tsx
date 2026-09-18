import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { NotesForm } from "@/components/sections/admin/NotesForm";
import { StatusUpdateForm } from "@/components/sections/admin/StatusUpdateForm";
import { getInquiry } from "@/lib/inquiries/admin-data";
import { SESSION_TYPE_LABELS } from "@/lib/inquiries/types";
import { formatDateTime } from "@/lib/utils/format-date";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SectionCard } from "@/components/admin/ui/Card";

export const metadata: Metadata = {
  title: "Booking Detail",
  robots: { index: false, follow: false },
};

function Field({ label, value }: { label: string; value?: string | number | null }) {
  if (!value) return null;
  return (
    <div className="border-b border-slate-100 py-2.5 last:border-b-0">
      <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">{label}</p>
      <p className="mt-0.5 text-sm text-slate-800">{value}</p>
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
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title={inquiry.customer.name}
        description={`Submitted ${formatDateTime(inquiry.createdAt)}`}
        back={{ href: "/admin/bookings", label: "All Bookings" }}
      />

      <div className="space-y-6">
        <SectionCard title="Status">
          <StatusUpdateForm id={inquiry.id} currentStatus={inquiry.status} />
        </SectionCard>

        <SectionCard title="Customer">
          <Field label="Name" value={inquiry.customer.name} />
          <Field label="Email" value={inquiry.customer.email} />
          <Field label="Phone / WhatsApp" value={inquiry.customer.phone} />
          <Field label="Preferred Contact Method" value={inquiry.contactPreference} />
          <Field label="Consent to Contact" value={inquiry.consent ? "Yes" : "No"} />
        </SectionCard>

        <SectionCard title="Session">
          <Field label="Type" value={SESSION_TYPE_LABELS[inquiry.session.type]} />
          <Field label="Package" value={inquiry.session.package} />
          <Field label="Preferred Date" value={inquiry.session.preferredDate} />
          <Field label="Preferred Time" value={inquiry.session.preferredTime} />
          <Field label="Alternative Date" value={inquiry.session.alternativeDate} />
          <Field label="Family Members" value={inquiry.familyMembers} />
        </SectionCard>

        {inquiry.baby.name || inquiry.baby.dateOfBirth || inquiry.baby.dueDate ? (
          <SectionCard title="Baby">
            <Field label="Name" value={inquiry.baby.name} />
            <Field label="Date of Birth" value={inquiry.baby.dateOfBirth} />
            <Field label="Expected Due Date" value={inquiry.baby.dueDate} />
          </SectionCard>
        ) : null}

        {inquiry.message ? (
          <SectionCard title="Message">
            <p className="text-sm leading-relaxed text-slate-700">{inquiry.message}</p>
          </SectionCard>
        ) : null}

        <SectionCard title="Notes & Follow-up">
          <NotesForm id={inquiry.id} adminNotes={inquiry.adminNotes} followUpDate={inquiry.followUpDate} />
        </SectionCard>
      </div>
    </div>
  );
}
