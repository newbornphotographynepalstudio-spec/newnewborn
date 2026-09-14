"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { INQUIRY_STATUSES, SESSION_TYPE_LABELS, STATUS_LABELS, type Inquiry, type InquiryStatus } from "@/lib/inquiries/types";

const statusToneClass: Record<string, string> = {
  new: "bg-blush text-plum",
  contacted: "bg-white text-charcoal border border-taupe/30",
  booked: "bg-plum text-white",
  closed: "bg-stone-soft text-taupe",
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
      <div className="mt-lg flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Search name, email, phone, package…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="min-w-[240px] flex-1 rounded-sm border border-taupe/40 bg-white px-3 py-2 text-small text-charcoal"
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as InquiryStatus | "all")}
          className="rounded-sm border border-taupe/40 bg-white px-3 py-2 text-small text-charcoal"
        >
          <option value="all">All statuses</option>
          {INQUIRY_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
        <select
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value as SortOrder)}
          className="rounded-sm border border-taupe/40 bg-white px-3 py-2 text-small text-charcoal"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      <p className="mt-3 text-caption text-charcoal/60">
        Showing {filtered.length} of {inquiries.length}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-4 border border-dashed border-taupe/40 bg-white p-lg text-small text-taupe">
          No enquiries match this search/filter.
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto border border-taupe/20 bg-white">
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
              {filtered.map((inquiry) => (
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
