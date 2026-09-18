import Link from "next/link";

import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StatCard } from "@/components/admin/ui/StatCard";
import { Card } from "@/components/admin/ui/Card";
import { Badge, type BadgeTone } from "@/components/admin/ui/Badge";
import { Table, TableHead, Th, TableBody, Tr, Td } from "@/components/admin/ui/Table";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import {
  BlogIcon,
  BookingsIcon,
  FaqIcon,
  MediaIcon,
  PackageIcon,
  PortfolioIcon,
  SecurityIcon,
  SeoIcon,
  SettingsIcon,
} from "@/components/admin/ui/icons";
import { listAllPosts } from "@/lib/blog/admin-data";
import { listFaqsAdmin } from "@/lib/faq/admin-data";
import { getInquiryStats } from "@/lib/inquiries/stats";
import { SESSION_TYPE_LABELS, STATUS_LABELS, type InquiryStatus } from "@/lib/inquiries/types";
import { listMedia } from "@/lib/media/library-data";
import { getSystemDiagnostics } from "@/lib/settings/diagnostics";
import { formatDate } from "@/lib/utils/format-date";

const statusTone: Record<InquiryStatus, BadgeTone> = {
  new: "warning",
  contacted: "info",
  booked: "accent",
  closed: "neutral",
};

const quickLinks = [
  { label: "Bookings & Inquiries", href: "/admin/bookings", description: "View and manage every enquiry.", icon: BookingsIcon },
  { label: "Packages", href: "/admin/packages", description: "Edit pricing, inclusions and featured package.", icon: PackageIcon },
  { label: "Blog", href: "/admin/blog", description: "Write, publish and manage articles.", icon: BlogIcon },
  { label: "FAQs", href: "/admin/faqs", description: "Edit questions shown on /faq/ and the homepage.", icon: FaqIcon },
  { label: "Media Library", href: "/admin/media", description: "Upload and manage photos.", icon: MediaIcon },
  { label: "Portfolio Photos", href: "/admin/portfolio", description: "Edit captions, categories and featured status.", icon: PortfolioIcon },
  { label: "SEO", href: "/admin/seo", description: "Global SEO, per-page overrides, schema inspector.", icon: SeoIcon },
  { label: "Site Settings", href: "/admin/settings", description: "Social links, system status, integrations.", icon: SettingsIcon },
  { label: "Security", href: "/admin/security", description: "Audit log of admin changes.", icon: SecurityIcon },
];

export default async function AdminDashboardPage() {
  const [stats, posts, faqs, media, diagnostics] = await Promise.all([
    getInquiryStats(),
    listAllPosts(),
    listFaqsAdmin(),
    listMedia(),
    getSystemDiagnostics(),
  ]);
  const publishedPostCount = posts.configured ? posts.posts.filter((p) => p.status === "published").length : 0;
  const faqCount = faqs.configured ? faqs.faqs.length : 0;
  const mediaCount = media.configured ? media.assets.length : 0;

  return (
    <div>
      <PageHeader title="Dashboard" description="A quick overview of enquiries and content, all from real data." />

      {!stats.configured ? (
        <EmptyState
          title="Firebase Admin credentials aren't configured"
          description="Live numbers can't be loaded in this environment yet."
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            <StatCard label="Total Enquiries" value={stats.total} />
            <StatCard label="New" value={stats.newCount} tone={stats.newCount > 0 ? "warning" : "default"} />
            <StatCard label="Contacted" value={stats.contactedCount} />
            <StatCard label="Booked" value={stats.bookedCount} tone="accent" />
            <StatCard
              label="Follow-ups Due"
              value={stats.dueFollowUpCount}
              tone={stats.dueFollowUpCount > 0 ? "warning" : "default"}
            />
          </div>

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Recent Enquiries</h2>
              <Link href="/admin/bookings" className="text-sm font-medium text-plum hover:underline">
                View all
              </Link>
            </div>
            {stats.recent.length === 0 ? (
              <EmptyState
                title="No enquiries yet"
                description="They'll appear here as soon as someone books through the website."
              />
            ) : (
              <Table minWidth={520}>
                <TableHead>
                  <Th>Name</Th>
                  <Th>Session</Th>
                  <Th>Submitted</Th>
                  <Th>Status</Th>
                </TableHead>
                <TableBody>
                  {stats.recent.map((inquiry) => (
                    <Tr key={inquiry.id}>
                      <Td>
                        <Link href={`/admin/bookings/${inquiry.id}`} className="font-medium text-plum hover:underline">
                          {inquiry.customer.name || "—"}
                        </Link>
                      </Td>
                      <Td>{SESSION_TYPE_LABELS[inquiry.session.type]}</Td>
                      <Td className="text-slate-500">{formatDate(inquiry.createdAt)}</Td>
                      <Td>
                        <Badge tone={statusTone[inquiry.status]}>{STATUS_LABELS[inquiry.status]}</Badge>
                      </Td>
                    </Tr>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </>
      )}

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-slate-900">Content</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Published Blog Posts" value={publishedPostCount} />
          <StatCard label="FAQs" value={faqCount} />
          <StatCard label="Media Library Photos" value={mediaCount} />
          <StatCard
            label="System Status"
            value={[diagnostics.firestoreConnected, diagnostics.authConnected].filter(Boolean).length}
            suffix="/ 2 connected"
          />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-slate-900">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href} className="block h-full">
                <Card className="h-full p-4 transition-colors hover:border-plum/40">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                      <Icon width={17} height={17} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900">{link.label}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{link.description}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
