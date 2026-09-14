import Link from "next/link";
import type { Metadata } from "next";

import { EffectiveSeoCard } from "@/components/sections/admin/EffectiveSeoCard";
import { getEffectiveBlogRows, getEffectiveSeoRows } from "@/lib/seo/effective-seo";

export const metadata: Metadata = {
  title: "Page SEO",
  robots: { index: false, follow: false },
};

export default async function AdminPageSeoListPage() {
  const [rows, blogRows] = await Promise.all([getEffectiveSeoRows(), getEffectiveBlogRows()]);
  const overrideCount = rows.filter((r) => r.hasOverride).length;

  return (
    <div className="mx-auto max-w-4xl px-gutter py-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h2 text-plum">Page SEO</h1>
          <p className="mt-2xs text-small text-charcoal/70">
            The actual title, description, canonical, robots, Open Graph, Twitter and schema being
            served for every public page right now — not just a list of overrides. {overrideCount}{" "}
            of {rows.length} page{rows.length === 1 ? "" : "s"} {overrideCount === 1 ? "has" : "have"}{" "}
            an admin override active; every other page is using its own built-in default.
          </p>
        </div>
        <Link href="/admin/seo/pages/new" className="shrink-0 rounded-sm bg-plum px-4 py-2 text-small font-medium text-white">
          Add Override
        </Link>
      </div>

      <div className="mt-lg space-y-4">
        {rows.map((row) => (
          <EffectiveSeoCard key={row.path} row={row} />
        ))}
      </div>

      {blogRows.length > 0 ? (
        <div className="mt-2xl">
          <h2 className="text-h4 text-plum">Blog Posts</h2>
          <p className="mt-1 text-caption text-charcoal/60">
            Each published post carries its own SEO title/description directly (edit from{" "}
            <Link href="/admin/blog" className="text-plum hover:underline">
              Blog
            </Link>
            ), separately from the page overrides above.
          </p>
          <div className="mt-4 divide-y divide-taupe/15 border border-taupe/20 bg-white">
            {blogRows.map((row) => (
              <div key={row.path} className="px-4 py-3">
                <p className="font-medium text-plum">{row.label}</p>
                <p className="font-mono text-caption text-charcoal/60">{row.path}</p>
                <p className="mt-1 text-small text-charcoal/80">{row.title}</p>
                <p className="text-caption text-charcoal/60">{row.description}</p>
                <p className="mt-1 text-caption text-charcoal/50">Source: {row.source}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
