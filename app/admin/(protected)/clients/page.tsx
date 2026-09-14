import Link from "next/link";
import type { Metadata } from "next";

import { deriveClients, sessionTypeLabels } from "@/lib/inquiries/clients";
import { formatDate } from "@/lib/utils/format-date";

export const metadata: Metadata = {
  title: "Clients",
  robots: { index: false, follow: false },
};

export default async function AdminClientsPage() {
  const result = await deriveClients();

  return (
    <div className="mx-auto max-w-5xl px-gutter py-2xl">
      <h1 className="text-h2 text-plum">Clients</h1>
      <p className="mt-2xs text-small text-charcoal/70">
        Grouped from real enquiries by email/phone — not a separate database. A repeat enquiry
        from the same contact appears here once, with every enquiry it made.
      </p>

      {!result.configured ? (
        <div className="mt-lg border border-dashed border-taupe/40 bg-white p-lg text-small text-taupe">
          Firebase Admin credentials aren&apos;t configured in this environment yet.
        </div>
      ) : result.clients.length === 0 ? (
        <div className="mt-lg border border-dashed border-taupe/40 bg-white p-lg text-small text-taupe">
          No enquiries yet, so no clients to show.
        </div>
      ) : (
        <div className="mt-lg overflow-x-auto border border-taupe/20 bg-white">
          <table className="w-full min-w-[720px] text-left text-small">
            <thead className="border-b border-taupe/20 text-caption tracking-eyebrow text-taupe uppercase">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Sessions Enquired</th>
                <th className="px-4 py-3">Enquiries</th>
                <th className="px-4 py-3">Last Contact</th>
              </tr>
            </thead>
            <tbody>
              {result.clients.map((client) => (
                <tr key={client.key} className="border-b border-taupe/10 last:border-b-0 hover:bg-blush/40">
                  <td className="px-4 py-3 font-medium text-charcoal">{client.name || "-"}</td>
                  <td className="px-4 py-3 text-charcoal/80">
                    <div>{client.phone}</div>
                    <div className="text-caption text-taupe">{client.email}</div>
                  </td>
                  <td className="px-4 py-3 text-charcoal/80">{sessionTypeLabels(client.sessionTypes)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {client.inquiries.map((inquiry) => (
                        <Link
                          key={inquiry.id}
                          href={`/admin/bookings/${inquiry.id}`}
                          className="rounded-sm border border-taupe/30 px-2 py-1 text-caption text-plum hover:bg-blush/60"
                        >
                          {formatDate(inquiry.createdAt)}
                        </Link>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-charcoal/60">
                    {formatDate(client.lastInquiryAt)}
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
