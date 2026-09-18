import Link from "next/link";
import type { Metadata } from "next";

import { GlobalSeoForm } from "@/components/sections/admin/GlobalSeoForm";
import { listAllPosts } from "@/lib/blog/admin-data";
import sitemap from "@/app/sitemap";
import { listPageSeoOverrides } from "@/lib/seo/page-overrides";
import { siteConfig } from "@/lib/seo/site";
import { getSiteSettings } from "@/lib/settings/data";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StatCard } from "@/components/admin/ui/StatCard";
import { Card, SectionCard } from "@/components/admin/ui/Card";
import { ExternalLinkIcon, SeoIcon } from "@/components/admin/ui/icons";

export const metadata: Metadata = {
  title: "SEO",
  robots: { index: false, follow: false },
};

export default async function AdminSeoPage() {
  const [posts, overrides, sitemapEntries, settings] = await Promise.all([
    listAllPosts(),
    listPageSeoOverrides(),
    sitemap(),
    getSiteSettings(),
  ]);

  const publishedPosts = posts.configured ? posts.posts.filter((p) => p.status === "published") : [];
  const postsMissingSeoTitle = publishedPosts.filter((p) => !p.seoTitle).length;
  const postsMissingSeoDescription = publishedPosts.filter((p) => !p.seoDescription).length;

  return (
    <div>
      <PageHeader title="SEO" description="Real status, computed from the actual site — nothing here is estimated." />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Indexable Pages (Sitemap)" value={sitemapEntries.length} icon={<SeoIcon width={16} height={16} />} />
        <StatCard label="Published Blog Posts" value={publishedPosts.length} />
        <StatCard
          label="Posts Missing SEO Title"
          value={postsMissingSeoTitle}
          tone={postsMissingSeoTitle > 0 ? "warning" : "default"}
        />
        <StatCard label="Page SEO Overrides" value={overrides.configured ? overrides.overrides.length : 0} />
      </div>
      {postsMissingSeoDescription > 0 ? (
        <p className="mt-3 text-xs text-slate-500">
          {postsMissingSeoDescription} published post(s) have no custom SEO description — they fall back to the
          post excerpt, which is fine, but worth a look in{" "}
          <Link href="/admin/blog" className="text-plum hover:underline">
            Blog
          </Link>
          .
        </p>
      ) : null}

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Link href="/admin/seo/pages">
          <Card className="h-full p-5 transition-colors hover:border-plum/40">
            <p className="text-sm font-medium text-slate-900">Page SEO</p>
            <p className="mt-1 text-xs text-slate-500">
              Per-page title, description, canonical, OG/Twitter, index/follow overrides.
            </p>
          </Card>
        </Link>
        <Link href="/admin/seo/schema">
          <Card className="h-full p-5 transition-colors hover:border-plum/40">
            <p className="text-sm font-medium text-slate-900">Schema Inspector</p>
            <p className="mt-1 text-xs text-slate-500">View the actual structured data currently generated on real pages.</p>
          </Card>
        </Link>
        <Link href="/sitemap.xml" target="_blank">
          <Card className="h-full p-5 transition-colors hover:border-plum/40">
            <p className="flex items-center gap-1.5 text-sm font-medium text-slate-900">
              View Sitemap
              <ExternalLinkIcon width={13} height={13} className="text-slate-400" />
            </p>
            <p className="mt-1 text-xs text-slate-500">{siteConfig.url}/sitemap.xml — generated automatically by Next.js.</p>
          </Card>
        </Link>
      </div>

      <div className="mt-6">
        <SectionCard
          title="Global SEO"
          description="Each field below shows whether it's currently a saved override or using its code default, and exactly where that value shows up on the live site. Leave a field blank to keep using the code default."
        >
          <GlobalSeoForm
            current={settings.seo}
            defaults={{ siteName: "Newborn Photography Nepal", tagline: "Newborn, maternity, baby, cake smash and family photography by Navin", description: siteConfig.description }}
          />
        </SectionCard>
      </div>

      <div className="mt-6">
        <SectionCard title="Redirects">
          <p className="text-sm text-slate-600">
            Not managed from admin yet — the one existing redirect (/workshop/ → /training/) is defined in
            next.config.ts. Admin-managed redirects would need a code change to wire into live request
            handling safely (loop/validity checks plus a per-request lookup) and weren&apos;t built this phase
            to avoid adding that cost without a real use case yet.
          </p>
        </SectionCard>
      </div>
    </div>
  );
}
