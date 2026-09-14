import Link from "next/link";
import type { Metadata } from "next";

import { GlobalSeoForm } from "@/components/sections/admin/GlobalSeoForm";
import { listAllPosts } from "@/lib/blog/admin-data";
import sitemap from "@/app/sitemap";
import { listPageSeoOverrides } from "@/lib/seo/page-overrides";
import { siteConfig } from "@/lib/seo/site";
import { getSiteSettings } from "@/lib/settings/data";

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
    <div className="mx-auto max-w-5xl px-gutter py-2xl">
      <h1 className="text-h2 text-plum">SEO</h1>
      <p className="mt-2xs text-small text-charcoal/70">
        Real status, computed from the actual site — nothing here is estimated.
      </p>

      <div className="mt-lg grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Indexable Pages (Sitemap)" value={sitemapEntries.length} />
        <StatCard label="Published Blog Posts" value={publishedPosts.length} />
        <StatCard label="Posts Missing SEO Title" value={postsMissingSeoTitle} warn={postsMissingSeoTitle > 0} />
        <StatCard label="Page SEO Overrides" value={overrides.configured ? overrides.overrides.length : 0} />
      </div>
      {postsMissingSeoDescription > 0 ? (
        <p className="mt-3 text-caption text-taupe">
          {postsMissingSeoDescription} published post(s) have no custom SEO description — they
          fall back to the post excerpt, which is fine, but worth a look in{" "}
          <Link href="/admin/blog" className="text-plum hover:underline">
            Blog
          </Link>
          .
        </p>
      ) : null}

      <div className="mt-lg grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link href="/admin/seo/pages" className="block border border-taupe/20 bg-white p-5 hover:border-plum/40">
          <p className="text-small font-medium text-plum">Page SEO</p>
          <p className="mt-1 text-caption text-charcoal/60">
            Per-page title, description, canonical, OG/Twitter, index/follow overrides.
          </p>
        </Link>
        <Link href="/admin/seo/schema" className="block border border-taupe/20 bg-white p-5 hover:border-plum/40">
          <p className="text-small font-medium text-plum">Schema Inspector</p>
          <p className="mt-1 text-caption text-charcoal/60">
            View the actual structured data currently generated on real pages.
          </p>
        </Link>
        <Link href="/sitemap.xml" target="_blank" className="block border border-taupe/20 bg-white p-5 hover:border-plum/40">
          <p className="text-small font-medium text-plum">View Sitemap</p>
          <p className="mt-1 text-caption text-charcoal/60">
            {siteConfig.url}/sitemap.xml — generated automatically by Next.js.
          </p>
        </Link>
      </div>

      <div className="mt-lg border border-taupe/20 bg-white p-6">
        <h2 className="text-caption font-medium tracking-eyebrow text-taupe uppercase">Global SEO</h2>
        <p className="mt-2 text-caption text-charcoal/60">
          Used site-wide as the default whenever a page doesn&apos;t set its own title/description
          (every page currently does, so these defaults mainly show up in social previews and the
          browser tab&apos;s title suffix). Leave a field blank to keep the original value.
        </p>
        <div className="mt-4">
          <GlobalSeoForm
            current={settings.seo}
            defaults={{ siteName: "Newborn Photography Nepal", tagline: "Newborn, maternity, baby, cake smash and family photography by Navin", description: siteConfig.description }}
          />
        </div>
      </div>

      <div className="mt-lg border border-taupe/20 bg-white p-6">
        <h2 className="text-caption font-medium tracking-eyebrow text-taupe uppercase">Redirects</h2>
        <p className="mt-2 text-small text-charcoal/70">
          Not managed from admin yet — the one existing redirect (/workshop/ → /training/) is
          defined in next.config.ts. Admin-managed redirects would need a code change to wire
          into live request handling safely (loop/validity checks plus a per-request lookup) and
          weren&apos;t built this phase to avoid adding that cost without a real use case yet.
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, value, warn }: { label: string; value: number; warn?: boolean }) {
  return (
    <div className="border border-taupe/20 bg-white p-5">
      <p className="text-caption tracking-eyebrow text-taupe uppercase">{label}</p>
      <p className={`mt-2 text-h2 ${warn ? "text-plum" : "text-charcoal"}`}>{value}</p>
    </div>
  );
}
