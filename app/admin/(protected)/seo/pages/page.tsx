import Link from "next/link";
import type { Metadata } from "next";

import { EffectiveSeoCard } from "@/components/sections/admin/EffectiveSeoCard";
import { getEffectiveBlogRows, getEffectiveSeoRows } from "@/lib/seo/effective-seo";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { AdminButton } from "@/components/admin/ui/Button";
import { Card } from "@/components/admin/ui/Card";
import { PlusIcon } from "@/components/admin/ui/icons";

export const metadata: Metadata = {
  title: "Page SEO",
  robots: { index: false, follow: false },
};

export default async function AdminPageSeoListPage() {
  const [rows, blogRows] = await Promise.all([getEffectiveSeoRows(), getEffectiveBlogRows()]);
  const overrideCount = rows.filter((r) => r.hasOverride).length;

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Page SEO"
        description={`The actual title, description, canonical, robots, Open Graph, Twitter and schema being served for every public page right now — not just a list of overrides. ${overrideCount} of ${rows.length} page${rows.length === 1 ? "" : "s"} ${overrideCount === 1 ? "has" : "have"} an admin override active; every other page is using its own built-in default.`}
        action={
          <AdminButton href="/admin/seo/pages/new" variant="primary" icon={<PlusIcon width={15} height={15} />}>
            Add Override
          </AdminButton>
        }
      />

      <div className="space-y-4">
        {rows.map((row) => (
          <EffectiveSeoCard key={row.path} row={row} />
        ))}
      </div>

      {blogRows.length > 0 ? (
        <div className="mt-10">
          <h2 className="text-sm font-semibold text-slate-900">Blog Posts</h2>
          <p className="mt-1 text-xs text-slate-500">
            Each published post carries its own SEO title/description directly (edit from{" "}
            <Link href="/admin/blog" className="text-plum hover:underline">
              Blog
            </Link>
            ), separately from the page overrides above.
          </p>
          <Card className="mt-4 divide-y divide-slate-100">
            {blogRows.map((row) => (
              <div key={row.path} className="px-4 py-3">
                <p className="font-medium text-plum">{row.label}</p>
                <p className="font-mono text-xs text-slate-400">{row.path}</p>
                <p className="mt-1 text-sm text-slate-800">{row.title}</p>
                <p className="text-xs text-slate-500">{row.description}</p>
                <p className="mt-1 text-xs text-slate-400">Source: {row.source}</p>
              </div>
            ))}
          </Card>
        </div>
      ) : null}
    </div>
  );
}
