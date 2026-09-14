import Link from "next/link";

import { listAllPosts } from "@/lib/blog/admin-data";
import { listFaqsAdmin } from "@/lib/faq/admin-data";
import { getInquiryStats } from "@/lib/inquiries/stats";
import { SESSION_TYPE_LABELS, STATUS_LABELS } from "@/lib/inquiries/types";
import { listMedia } from "@/lib/media/library-data";
import { getSystemDiagnostics } from "@/lib/settings/diagnostics";

const statusToneClass: Record<string, string> = {
  new: "bg-blush text-plum",
  contacted: "bg-white text-charcoal border border-taupe/30",
  booked: "bg-plum text-white",
  closed: "bg-stone-soft text-taupe",
};

const quickLinks = [
  { label: "Bookings & Inquiries", href: "/admin/bookings", description: "View and manage every enquiry." },
  { label: "Packages", href: "/admin/packages", description: "Edit pricing, inclusions and featured package." },
  { label: "Blog", href: "/admin/blog", description: "Write, publish and manage articles." },
  { label: "FAQs", href: "/admin/faqs", description: "Edit questions shown on /faq/ and the homepage." },
  { label: "Media Library", href: "/admin/media", description: "Upload and manage photos." },
  { label: "Portfolio Photos", href: "/admin/portfolio", description: "Edit captions, categories and featured status." },
  { label: "SEO", href: "/admin/seo", description: "Global SEO, per-page overrides, schema inspector." },
  { label: "Site Settings", href: "/admin/settings", description: "Social links, system status, integrations." },
  { label: "Security", href: "/admin/security", description: "Audit log of admin changes." },
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
    <div className="mx-auto max-w-7xl px-gutter py-16">
      <h1 className="text-h2 text-plum">Dashboard</h1>
      <p className="mt-2 text-small text-charcoal/70">
        A quick overview of enquiries and content, all from real data.
      </p>

      {!stats.configured ? (
        <div className="mt-8 border border-dashed border-taupe/40 bg-white p-lg text-small text-taupe">
          Firebase Admin credentials aren&apos;t configured in this environment yet, so live
          numbers can&apos;t be loaded here.
        </div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
            <StatCard label="Total Enquiries" value={stats.total} />
            <StatCard label="New" value={stats.newCount} tone="new" />
            <StatCard label="Contacted" value={stats.contactedCount} tone="contacted" />
            <StatCard label="Booked" value={stats.bookedCount} tone="booked" />
            <StatCard label="Follow-ups Due" value={stats.dueFollowUpCount} tone={stats.dueFollowUpCount > 0 ? "new" : undefined} />
          </div>

          <div className="mt-12">
            <div className="flex items-center justify-between">
              <h2 className="text-h4 text-plum">Recent Enquiries</h2>
              <Link href="/admin/bookings" className="text-small text-plum hover:underline">
                View all
              </Link>
            </div>
            {stats.recent.length === 0 ? (
              <div className="mt-4 border border-dashed border-taupe/40 bg-white p-lg text-small text-taupe">
                No enquiries yet. They&apos;ll appear here as soon as someone books through the
                website.
              </div>
            ) : (
              <div className="mt-4 overflow-x-auto border border-taupe/20 bg-white">
                <table className="w-full min-w-[560px] text-left text-small">
                  <tbody>
                    {stats.recent.map((inquiry) => (
                      <tr key={inquiry.id} className="border-b border-taupe/10 last:border-b-0 hover:bg-blush/40">
                        <td className="px-4 py-3">
                          <Link href={`/admin/bookings/${inquiry.id}`} className="font-medium text-plum hover:underline">
                            {inquiry.customer.name || "-"}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-charcoal/80">
                          {SESSION_TYPE_LABELS[inquiry.session.type]}
                        </td>
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
        </>
      )}

      <div className="mt-12">
        <h2 className="text-h4 text-plum">Content</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Published Blog Posts" value={publishedPostCount} />
          <StatCard label="FAQs" value={faqCount} />
          <StatCard label="Media Library Photos" value={mediaCount} />
          <StatCard
            label="System Status"
            value={
              [diagnostics.firestoreConnected, diagnostics.authConnected].filter(Boolean).length
            }
            suffix="/2 connected"
          />
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-h4 text-plum">Quick Actions</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block h-full rounded-sm border border-taupe/20 bg-white p-5 hover:border-plum/40"
              >
                <p className="text-small font-medium text-plum">{link.label}</p>
                <p className="mt-1 text-caption text-charcoal/60">{link.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StatCard({ label, value, tone, suffix }: { label: string; value: number; tone?: string; suffix?: string }) {
  return (
    <div className="border border-taupe/20 bg-white p-5">
      <p className="text-caption tracking-eyebrow text-taupe uppercase">{label}</p>
      <p className={`mt-2 text-h2 ${tone ? "text-plum" : "text-charcoal"}`}>
        {value}
        {suffix ? <span className="text-small text-charcoal/60">{suffix}</span> : null}
      </p>
    </div>
  );
}
