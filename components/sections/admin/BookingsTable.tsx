"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { INQUIRY_STATUSES, SESSION_TYPE_LABELS, STATUS_LABELS, type Inquiry, type InquiryStatus } from "@/lib/inquiries/types";
import { formatDate } from "@/lib/utils/format-date";
import { AdminInput, AdminSelect } from "@/components/admin/ui/fields";
import { Badge, type BadgeTone } from "@/components/admin/ui/Badge";
import { Table, TableHead, Th, TableBody, Tr, Td } from "@/components/admin/ui/Table";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { SearchIcon } from "@/components/admin/ui/icons";

const statusTone: Record<InquiryStatus, BadgeTone> = {
  new: "warning",
  contacted: "info",
  booked: "accent",
  closed: "neutral",
};

type SortOrder = "newest" | "oldest";

export function BookingsTable({ inquiries }: { inquiries: Inquiry[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | "all">("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    let result = inquiries.filter((inquiry) => {
      if (statusFilter !== "all" && inquiry.status !== statusFilter) return false;
      if (!term) return true;
      const haystack = [
        inquiry.customer.name,
        inquiry.customer.email,
        inquiry.customer.phone,
        inquiry.session.package,
        SESSION_TYPE_LABELS[inquiry.session.type],
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
    result = [...result].sort((a, b) => {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? -diff : diff;
    });
    return result;
  }, [inquiries, search, statusFilter, sortOrder]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <SearchIcon width={16} height={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
          <AdminInput
            type="search"
            placeholder="Search name, email, phone, package…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>
        <AdminSelect
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as InquiryStatus | "all")}
          className="w-auto"
        >
          <option value="all">All statuses</option>
          {INQUIRY_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </AdminSelect>
        <AdminSelect
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value as SortOrder)}
          className="w-auto"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </AdminSelect>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Showing {filtered.length} of {inquiries.length}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="No enquiries match this search/filter" />
        </div>
      ) : (
        <div className="mt-4">
          <Table minWidth={720}>
            <TableHead>
              <Th>Name</Th>
              <Th>Contact</Th>
              <Th>Session</Th>
              <Th>Package</Th>
              <Th>Preferred Date</Th>
              <Th>Submitted</Th>
              <Th>Status</Th>
            </TableHead>
            <TableBody>
              {filtered.map((inquiry) => (
                <Tr key={inquiry.id}>
                  <Td>
                    <Link href={`/admin/bookings/${inquiry.id}`} className="font-medium text-plum hover:underline">
                      {inquiry.customer.name || "—"}
                    </Link>
                  </Td>
                  <Td>
                    <div>{inquiry.customer.phone}</div>
                    <div className="text-xs text-slate-400">{inquiry.customer.email}</div>
                  </Td>
                  <Td>{SESSION_TYPE_LABELS[inquiry.session.type]}</Td>
                  <Td>{inquiry.session.package || "—"}</Td>
                  <Td>{inquiry.session.preferredDate || "—"}</Td>
                  <Td className="text-slate-500">{formatDate(inquiry.createdAt)}</Td>
                  <Td>
                    <Badge tone={statusTone[inquiry.status]}>{STATUS_LABELS[inquiry.status]}</Badge>
                  </Td>
                </Tr>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
