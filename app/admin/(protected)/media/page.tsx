import type { Metadata } from "next";

import { ExistingPhotoCard } from "@/components/sections/admin/ExistingPhotoCard";
import { MediaLibraryGrid } from "@/components/sections/admin/MediaLibraryGrid";
import { UploadMediaForm } from "@/components/sections/admin/UploadMediaForm";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SectionCard } from "@/components/admin/ui/Card";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { AlertIcon, MediaIcon } from "@/components/admin/ui/icons";
import { listExistingPhotos } from "@/lib/media/existing-photos";
import { listMedia } from "@/lib/media/library-data";
import { getSystemDiagnostics } from "@/lib/settings/diagnostics";

export const metadata: Metadata = {
  title: "Media Library",
  robots: { index: false, follow: false },
};

/**
 * Raises this route's serverless execution limit from Vercel's default
 * (10s on Hobby) to the platform's max on Hobby (60s) — found live:
 * uploadMedia (lib/media/library-actions.ts) processes files one at a
 * time (Storage upload, then a Firestore write, per file), and a real
 * multi-photo batch of ordinary camera-export sizes measured well past
 * 10s end-to-end even against a local, unconstrained server. On Vercel,
 * a request that outlives the function's time limit is killed by the
 * platform before our own try/catch ever runs — which surfaces to the
 * browser as an unhandled failure (the global app/error.tsx boundary),
 * not the graceful inline message uploadMedia's own error handling
 * returns for every failure it actually gets to see. This alone doesn't
 * make a large batch instant, but it gives real uploads enough room to
 * finish inside a single request on Vercel's serverless limits.
 *
 * UI-redesign note: unchanged from the pre-redesign value — this is
 * purely a UI/UX pass, this line is load-bearing production behavior.
 */
export const maxDuration = 60;

export default async function AdminMediaPage() {
  const [result, diagnostics] = await Promise.all([listMedia(), getSystemDiagnostics()]);
  const existingPhotos = listExistingPhotos();

  return (
    <div>
      <PageHeader
        title="Media Library"
        description="Two kinds of photography live here: the studio's original, already-approved photography (read-only) and anything uploaded below, which becomes available to its matching portfolio page and, if marked Featured, the homepage."
      />

      {!diagnostics.mediaStorageConfigured ? (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <AlertIcon width={18} height={18} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Photo storage isn&apos;t configured yet.</p>
            <p className="mt-1 text-amber-700">
              Uploads will fail until it is. See Site Settings for exactly what&apos;s needed — this page is
              otherwise ready to use immediately once that&apos;s set.
            </p>
          </div>
        </div>
      ) : !diagnostics.mediaStorageConnected ? (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <AlertIcon width={18} height={18} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Photo storage is configured but not reachable.</p>
            <p className="mt-1 text-amber-700">See Site Settings for the likely cause.</p>
          </div>
        </div>
      ) : null}

      <SectionCard title="Upload Photos" description="JPEG, PNG or WebP, up to 20MB each.">
        <UploadMediaForm />
      </SectionCard>

      <div className="mt-8">
        <h2 className="mb-1 text-sm font-semibold text-slate-900">Uploaded Library</h2>
        <p className="mb-4 text-xs text-slate-500">
          Stored in Supabase Storage; metadata below is editable and drives the matching portfolio page /
          homepage Featured Work directly.
        </p>
        {!result.configured ? (
          <EmptyState
            icon={<MediaIcon width={28} height={28} />}
            title="Firebase Admin credentials aren't configured"
            description="This environment can't load the media library yet."
          />
        ) : result.assets.length === 0 ? (
          <EmptyState
            icon={<MediaIcon width={28} height={28} />}
            title="No photos uploaded yet"
            description="Upload photos above to add them to the Media Library."
          />
        ) : (
          <MediaLibraryGrid assets={result.assets} />
        )}
      </div>

      <div className="mt-10">
        <h2 className="mb-1 text-sm font-semibold text-slate-900">Existing Approved Photography</h2>
        <p className="mb-4 text-xs text-slate-500">
          The site&apos;s original, client-supplied photography already live on the public portfolio pages.
          Read-only here — its metadata is code-controlled, not a database row, so it can&apos;t be edited or
          deleted from this page. Nothing here is stored in Supabase.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {existingPhotos.map((photo) => (
            <ExistingPhotoCard key={photo.id} photo={photo} />
          ))}
        </div>
      </div>
    </div>
  );
}
