import Link from "next/link";

import { DeletePageSeoButton } from "@/components/sections/admin/DeletePageSeoButton";
import type { EffectiveSeoRow } from "@/lib/seo/effective-seo";

function Field({ label, value, source }: { label: string; value: string; source?: string }) {
  if (!value) return null;
  return (
    <div className="border-t border-taupe/10 pt-2">
      <dt className="text-caption font-medium tracking-eyebrow text-taupe uppercase">{label}</dt>
      <dd className="mt-0.5 text-small text-charcoal">{value}</dd>
      {source ? <dd className="mt-0.5 text-caption text-charcoal/50">Source: {source}</dd> : null}
    </div>
  );
}

export function EffectiveSeoCard({ row }: { row: EffectiveSeoRow }) {
  return (
    <div className="border border-taupe/20 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-h5 text-plum">{row.label}</h3>
          <p className="font-mono text-caption text-charcoal/60">{row.path}</p>
        </div>
        <div className="flex items-center gap-3">
          {row.hasOverride ? (
            <span className="rounded-sm bg-blush px-2 py-0.5 text-caption font-medium text-plum">
              Admin override active
            </span>
          ) : (
            <span className="rounded-sm bg-stone-soft px-2 py-0.5 text-caption font-medium text-charcoal/60">
              Code default
            </span>
          )}
          {row.hasOverride ? (
            <>
              <Link href={`/admin/seo/pages/${row.docId}`} className="text-caption text-plum hover:underline">
                Edit override
              </Link>
              <DeletePageSeoButton docId={row.docId} path={row.path} />
            </>
          ) : (
            <Link
              href={`/admin/seo/pages/new?path=${encodeURIComponent(row.path)}`}
              className="text-caption text-plum hover:underline"
            >
              Create override
            </Link>
          )}
        </div>
      </div>

      <dl className="mt-3 space-y-2">
        <Field label="Effective title" value={row.title} source={row.titleSource} />
        <Field label="Effective meta description" value={row.description} source={row.descriptionSource} />
        <Field label="Effective canonical" value={row.canonical} source={row.canonicalSource} />
        <Field label="Effective robots" value={row.robots} source={row.robotsSource} />
        <Field label="Open Graph title" value={row.ogTitle} />
        <Field label="Open Graph description" value={row.ogDescription} />
        <Field label="Open Graph image" value={row.ogImage} />
        <Field label="Twitter title" value={row.twitterTitle} />
        <Field label="Twitter description" value={row.twitterDescription} />
        <Field label="Twitter image" value={row.twitterImage} />
        <Field label="JSON-LD / schema" value={row.schema} />
      </dl>
    </div>
  );
}
