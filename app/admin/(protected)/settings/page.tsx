import type { Metadata } from "next";

import { SocialLinksForm } from "@/components/sections/admin/SocialLinksForm";
import { getSiteSettings } from "@/lib/settings/data";
import { getSystemDiagnostics } from "@/lib/settings/diagnostics";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SectionCard } from "@/components/admin/ui/Card";
import { Badge } from "@/components/admin/ui/Badge";

export const metadata: Metadata = {
  title: "Site Settings",
  robots: { index: false, follow: false },
};

function StatusBadge({ ok, yesLabel, noLabel }: { ok: boolean; yesLabel: string; noLabel: string }) {
  return <Badge tone={ok ? "success" : "neutral"}>{ok ? yesLabel : noLabel}</Badge>;
}

export default async function AdminSettingsPage() {
  const [settings, diagnostics] = await Promise.all([getSiteSettings(), getSystemDiagnostics()]);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Site Settings" description="System status and site-wide configuration." />

      <SectionCard title="System Status" className="mb-6">
        <dl className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <dt className="text-sm text-slate-700">Firestore connection</dt>
            <dd><StatusBadge ok={diagnostics.firestoreConnected} yesLabel="Connected" noLabel="Not connected" /></dd>
          </div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <dt className="text-sm text-slate-700">Firebase Authentication</dt>
            <dd><StatusBadge ok={diagnostics.authConnected} yesLabel="Connected" noLabel="Not connected" /></dd>
          </div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <dt className="text-sm text-slate-700">Media storage (Supabase)</dt>
            <dd>
              <StatusBadge
                ok={diagnostics.mediaStorageConfigured && diagnostics.mediaStorageConnected}
                yesLabel="Connected"
                noLabel={diagnostics.mediaStorageConfigured ? "Configured, not reachable" : "Not configured"}
              />
            </dd>
          </div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <dt className="text-sm text-slate-700">Booking email notifications</dt>
            <dd><StatusBadge ok={diagnostics.emailConfigured} yesLabel="Configured" noLabel="Not configured" /></dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-sm text-slate-700">Google Reviews (Places API)</dt>
            <dd><StatusBadge ok={diagnostics.googlePlacesConfigured} yesLabel="Configured" noLabel="Disabled (intentional)" /></dd>
          </div>
        </dl>
        {!diagnostics.mediaStorageConfigured ? (
          <p className="mt-4 text-xs text-slate-500">
            Media Library uploads need a Supabase project: set NEXT_PUBLIC_SUPABASE_URL and
            SUPABASE_SERVICE_ROLE_KEY as environment variables, and create a public bucket named &quot;media&quot;
            in that project&apos;s Storage dashboard. The service role key is server-only and is never sent to
            the browser.
          </p>
        ) : !diagnostics.mediaStorageConnected ? (
          <p className="mt-4 text-xs text-slate-500">
            Supabase credentials are set, but the &quot;media&quot; bucket couldn&apos;t be reached — confirm it
            exists and is public in the Supabase Storage dashboard.
          </p>
        ) : null}
        {!diagnostics.emailConfigured ? (
          <p className="mt-4 text-xs text-slate-500">
            Set RESEND_API_KEY as a server-only environment variable to email the studio when a new booking
            comes in. The booking still saves to Firestore and appears in admin either way — this only affects
            the email notification.
          </p>
        ) : null}
        {!diagnostics.googlePlacesConfigured ? (
          <p className="mt-4 text-xs text-slate-500">
            Intentionally disabled — connecting live Google Reviews would require a Google Cloud Billing
            account, which is out of scope for this project&apos;s budget. The homepage correctly shows an
            honest empty state with a link to the real Google review page instead. Nothing needs to be
            configured here.
          </p>
        ) : (
          <p className="mt-4 text-xs text-slate-500">
            Place ID: <span className="font-mono">{diagnostics.googlePlacesIdMasked}</span> (masked — the full
            value and the API key are never shown here or sent to the browser).
          </p>
        )}
      </SectionCard>

      <SectionCard title="Social Links" description="Shown in the footer. Leave blank to hide a platform.">
        <SocialLinksForm current={settings.socialLinks} />
      </SectionCard>
    </div>
  );
}
