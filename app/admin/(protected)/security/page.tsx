import type { Metadata } from "next";

import { listAuditLog } from "@/lib/audit/data";
import { formatDateTime } from "@/lib/utils/format-date";

export const metadata: Metadata = {
  title: "Security",
  robots: { index: false, follow: false },
};

export default async function AdminSecurityPage() {
  const result = await listAuditLog();

  return (
    <div className="mx-auto max-w-5xl px-gutter py-2xl">
      <h1 className="text-h2 text-plum">Security</h1>
      <p className="mt-2xs text-small text-charcoal/70">
        A record of admin changes, and account status.
      </p>

      <div className="mt-lg border border-taupe/20 bg-white p-6">
        <h2 className="text-caption font-medium tracking-eyebrow text-taupe uppercase">Login Activity</h2>
        <p className="mt-2 text-small text-charcoal/70">
          Not available. Firebase Authentication doesn&apos;t expose sign-in history without
          additionally configuring Google Cloud Logging, which isn&apos;t set up for this
          project. Every session-cookie check does still require the real{" "}
          <code className="text-caption">admin</code> custom claim on every protected request,
          whether or not this history is visible.
        </p>
      </div>

      <div className="mt-lg border border-taupe/20 bg-white p-6">
        <h2 className="text-caption font-medium tracking-eyebrow text-taupe uppercase">Audit Log</h2>
        <p className="mt-2 text-small text-charcoal/70">
          The most recent 50 admin changes: bookings, packages, blog posts and settings.
        </p>

        {!result.configured ? (
          <div className="mt-4 border border-dashed border-taupe/40 bg-blush/20 p-lg text-small text-taupe">
            Firebase Admin credentials aren&apos;t configured in this environment yet.
          </div>
        ) : result.entries.length === 0 ? (
          <div className="mt-4 border border-dashed border-taupe/40 bg-blush/20 p-lg text-small text-taupe">
            No admin changes recorded yet. Entries appear here automatically from now on.
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto border-t border-taupe/20">
            <table className="w-full min-w-[640px] text-left text-small">
              <thead className="border-b border-taupe/20 text-caption tracking-eyebrow text-taupe uppercase">
                <tr>
                  <th className="px-4 py-3">When</th>
                  <th className="px-4 py-3">Who</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Details</th>
                </tr>
              </thead>
              <tbody>
                {result.entries.map((entry) => (
                  <tr key={entry.id} className="border-b border-taupe/10 last:border-b-0">
                    <td className="px-4 py-3 whitespace-nowrap text-charcoal/60">
                      {formatDateTime(entry.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-charcoal/80">{entry.actorEmail}</td>
                    <td className="px-4 py-3 font-mono text-caption text-charcoal/80">{entry.action}</td>
                    <td className="px-4 py-3 text-charcoal/70">{entry.details ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
