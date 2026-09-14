import Link from "next/link";
import type { Metadata } from "next";

import { DeletePageSeoButton } from "@/components/sections/admin/DeletePageSeoButton";
import { listPageSeoOverrides, pathToDocId } from "@/lib/seo/page-overrides";

export const metadata: Metadata = {
  title: "Page SEO",
  robots: { index: false, follow: false },
};

export default async function AdminPageSeoListPage() {
  const result = await listPageSeoOverrides();

  return (
    <div className="mx-auto max-w-4xl px-gutter py-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h2 text-plum">Page SEO</h1>
          <p className="mt-2xs text-small text-charcoal/70">
            Per-page overrides. A page with no override here uses its own built-in title and
            description, unchanged.
          </p>
        </div>
        <Link href="/admin/seo/pages/new" className="rounded-sm bg-plum px-4 py-2 text-small font-medium text-white">
          Add Override
        </Link>
      </div>

      {!result.configured ? (
        <div className="mt-lg border border-dashed border-taupe/40 bg-white p-lg text-small text-taupe">
          Firebase Admin credentials aren&apos;t configured in this environment yet.
        </div>
      ) : result.overrides.length === 0 ? (
        <div className="mt-lg border border-dashed border-taupe/40 bg-white p-lg text-small text-taupe">
          No page overrides yet. Every page is using its own default SEO metadata.
        </div>
      ) : (
        <div className="mt-lg divide-y divide-taupe/15 border border-taupe/20 bg-white">
          {result.overrides.map((override) => (
            <div key={override.path} className="flex items-center justify-between gap-4 px-4 py-3">
              <div>
                <Link href={`/admin/seo/pages/${pathToDocId(override.path)}`} className="font-medium text-plum hover:underline">
                  {override.path}
                </Link>
                {override.seoTitle ? <p className="text-caption text-charcoal/60">{override.seoTitle}</p> : null}
                {override.noindex ? <span className="text-caption text-plum">noindex</span> : null}
              </div>
              <DeletePageSeoButton docId={pathToDocId(override.path)} path={override.path} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
