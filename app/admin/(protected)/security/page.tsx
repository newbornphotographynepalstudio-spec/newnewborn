import type { Metadata } from "next";

import { listAuditLog } from "@/lib/audit/data";
import { formatDateTime } from "@/lib/utils/format-date";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SectionCard } from "@/components/admin/ui/Card";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { Table, TableHead, Th, TableBody, Tr, Td } from "@/components/admin/ui/Table";
import { SecurityIcon } from "@/components/admin/ui/icons";

export const metadata: Metadata = {
  title: "Security",
  robots: { index: false, follow: false },
};

export default async function AdminSecurityPage() {
  const result = await listAuditLog();

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Security" description="A record of admin changes, and account status." />

      <SectionCard title="Login Activity" className="mb-6">
        <p className="text-sm text-slate-600">
          Not available. Firebase Authentication doesn&apos;t expose sign-in history without additionally
          configuring Google Cloud Logging, which isn&apos;t set up for this project. Every session-cookie
          check does still require the real <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">admin</code>{" "}
          custom claim on every protected request, whether or not this history is visible.
        </p>
      </SectionCard>

      <SectionCard
        title="Audit Log"
        description="The most recent 50 admin changes: bookings, packages, blog posts and settings."
      >
        {!result.configured ? (
          <EmptyState icon={<SecurityIcon width={28} height={28} />} title="Firebase Admin credentials aren't configured" />
        ) : result.entries.length === 0 ? (
          <EmptyState
            icon={<SecurityIcon width={28} height={28} />}
            title="No admin changes recorded yet"
            description="Entries appear here automatically from now on."
          />
        ) : (
          <Table minWidth={560}>
            <TableHead>
              <Th>When</Th>
              <Th>Who</Th>
              <Th>Action</Th>
              <Th>Details</Th>
            </TableHead>
            <TableBody>
              {result.entries.map((entry) => (
                <Tr key={entry.id}>
                  <Td className="whitespace-nowrap text-slate-500">{formatDateTime(entry.createdAt)}</Td>
                  <Td>{entry.actorEmail}</Td>
                  <Td className="font-mono text-xs">{entry.action}</Td>
                  <Td>{entry.details ?? "—"}</Td>
                </Tr>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>
    </div>
  );
}
