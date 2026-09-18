import Link from "next/link";
import type { Metadata } from "next";

import { deriveClients, sessionTypeLabels } from "@/lib/inquiries/clients";
import { formatDate } from "@/lib/utils/format-date";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { Table, TableHead, Th, TableBody, Tr, Td } from "@/components/admin/ui/Table";
import { ClientsIcon } from "@/components/admin/ui/icons";

export const metadata: Metadata = {
  title: "Clients",
  robots: { index: false, follow: false },
};

export default async function AdminClientsPage() {
  const result = await deriveClients();

  return (
    <div>
      <PageHeader
        title="Clients"
        description="Grouped from real enquiries by email/phone — not a separate database. A repeat enquiry from the same contact appears here once, with every enquiry it made."
      />

      {!result.configured ? (
        <EmptyState
          icon={<ClientsIcon width={28} height={28} />}
          title="Firebase Admin credentials aren't configured"
        />
      ) : result.clients.length === 0 ? (
        <EmptyState icon={<ClientsIcon width={28} height={28} />} title="No enquiries yet, so no clients to show" />
      ) : (
        <Table minWidth={720}>
          <TableHead>
            <Th>Name</Th>
            <Th>Contact</Th>
            <Th>Sessions Enquired</Th>
            <Th>Enquiries</Th>
            <Th>Last Contact</Th>
          </TableHead>
          <TableBody>
            {result.clients.map((client) => (
              <Tr key={client.key}>
                <Td className="font-medium text-slate-900">{client.name || "—"}</Td>
                <Td>
                  <div>{client.phone}</div>
                  <div className="text-xs text-slate-400">{client.email}</div>
                </Td>
                <Td>{sessionTypeLabels(client.sessionTypes)}</Td>
                <Td>
                  <div className="flex flex-wrap gap-1.5">
                    {client.inquiries.map((inquiry) => (
                      <Link
                        key={inquiry.id}
                        href={`/admin/bookings/${inquiry.id}`}
                        className="rounded-md border border-slate-200 px-2 py-0.5 text-xs text-plum hover:bg-slate-50"
                      >
                        {formatDate(inquiry.createdAt)}
                      </Link>
                    ))}
                  </div>
                </Td>
                <Td className="text-slate-500">{formatDate(client.lastInquiryAt)}</Td>
              </Tr>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
