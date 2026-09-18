import Link from "next/link";

import type { EffectiveSeoRow } from "@/lib/seo/effective-seo";
import { deletePageSeoOverride } from "@/lib/seo/page-overrides-actions";
import { Card } from "@/components/admin/ui/Card";
import { Badge } from "@/components/admin/ui/Badge";
import { ConfirmDeleteButton } from "@/components/admin/ui/ConfirmDialog";

function Field({ label, value, source }: { label: string; value: string; source?: string }) {
  if (!value) return null;
  return (
    <div className="border-t border-slate-100 pt-2 first:border-t-0 first:pt-0">
      <dt className="text-xs font-medium tracking-wide text-slate-400 uppercase">{label}</dt>
      <dd className="mt-0.5 text-sm text-slate-800">{value}</dd>
      {source ? <dd className="mt-0.5 text-xs text-slate-400">Source: {source}</dd> : null}
    </div>
  );
}

export function EffectiveSeoCard({ row }: { row: EffectiveSeoRow }) {
  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{row.label}</h3>
          <p className="font-mono text-xs text-slate-400">{row.path}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge tone={row.hasOverride ? "accent" : "neutral"}>
            {row.hasOverride ? "Admin override active" : "Code default"}
          </Badge>
          {row.hasOverride ? (
            <>
              <Link href={`/admin/seo/pages/${row.docId}`} className="text-xs font-medium text-plum hover:underline">
                Edit override
              </Link>
              <ConfirmDeleteButton
                itemLabel={row.path}
                triggerLabel="Remove"
                title={`Remove the SEO override for "${row.path}"?`}
                description="The page reverts to its default metadata."
                onConfirm={deletePageSeoOverride.bind(null, row.docId, row.path)}
              />
            </>
          ) : (
            <Link
              href={`/admin/seo/pages/new?path=${encodeURIComponent(row.path)}`}
              className="text-xs font-medium text-plum hover:underline"
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
    </Card>
  );
}
