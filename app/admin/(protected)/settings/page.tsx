import type { Metadata } from "next";

import { SocialLinksForm } from "@/components/sections/admin/SocialLinksForm";
import { getSiteSettings } from "@/lib/settings/data";
import { getSystemDiagnostics } from "@/lib/settings/diagnostics";

export const metadata: Metadata = {
  title: "Site Settings",
  robots: { index: false, follow: false },
};

function StatusBadge({ ok, yesLabel, noLabel }: { ok: boolean; yesLabel: string; noLabel: string }) {
  return (
    <span
      className={`inline-block rounded-sm px-2 py-1 text-caption font-medium uppercase ${
        ok ? "bg-plum text-white" : "border border-taupe/30 text-taupe"
      }`}
    >
      {ok ? yesLabel : noLabel}
    </span>
  );
}

export default async function AdminSettingsPage() {
  const [settings, diagnostics] = await Promise.all([getSiteSettings(), getSystemDiagnostics()]);

  return (
    <div className="mx-auto max-w-3xl px-gutter py-2xl">
      <h1 className="text-h2 text-plum">Site Settings</h1>
      <p className="mt-2xs text-small text-charcoal/70">
        System status and site-wide configuration.
      </p>

      <div className="mt-lg border border-taupe/20 bg-white p-6">
        <h2 className="text-caption font-medium tracking-eyebrow text-taupe uppercase">System Status</h2>
        <dl className="mt-4 space-y-3">
          <div className="flex items-center justify-between border-b border-taupe/15 pb-3">
            <dt className="text-small text-charcoal">Firestore connection</dt>
            <dd><StatusBadge ok={diagnostics.firestoreConnected} yesLabel="Connected" noLabel="Not connected" /></dd>
          </div>
          <div className="flex items-center justify-between border-b border-taupe/15 pb-3">
            <dt className="text-small text-charcoal">Firebase Storage</dt>
            <dd><StatusBadge ok={diagnostics.storageEnabled} yesLabel="Enabled" noLabel="Not enabled" /></dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-small text-charcoal">Google Reviews (Places API)</dt>
            <dd><StatusBadge ok={diagnostics.googlePlacesConfigured} yesLabel="Configured" noLabel="Not configured" /></dd>
          </div>
        </dl>
        {!diagnostics.storageEnabled ? (
          <p className="mt-4 text-caption text-charcoal/60">
            Photo uploads from admin need Firebase Storage enabled first: Firebase Console →
            Storage → Get Started. No code changes are needed once it&apos;s on.
          </p>
        ) : null}
        {!diagnostics.googlePlacesConfigured ? (
          <p className="mt-4 text-caption text-charcoal/60">
            Set GOOGLE_PLACES_API_KEY and GOOGLE_PLACES_PLACE_ID as server-only environment
            variables to show real Google reviews on the homepage (see docs/SETUP.md). The API
            key is never sent to the browser.
          </p>
        ) : null}
      </div>

      <div className="mt-lg border border-taupe/20 bg-white p-6">
        <h2 className="text-caption font-medium tracking-eyebrow text-taupe uppercase">Social Links</h2>
        <p className="mt-2 text-caption text-charcoal/60">
          Shown in the footer. Leave blank to hide a platform.
        </p>
        <div className="mt-4">
          <SocialLinksForm current={settings.socialLinks} />
        </div>
      </div>
    </div>
  );
}
