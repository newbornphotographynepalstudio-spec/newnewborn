import type { Metadata } from "next";

import { ExistingPhotoCard } from "@/components/sections/admin/ExistingPhotoCard";
import { MediaLibraryGrid } from "@/components/sections/admin/MediaLibraryGrid";
import { UploadMediaForm } from "@/components/sections/admin/UploadMediaForm";
import { listExistingPhotos } from "@/lib/media/existing-photos";
import { listMedia } from "@/lib/media/library-data";
import { getSystemDiagnostics } from "@/lib/settings/diagnostics";

export const metadata: Metadata = {
  title: "Media Library",
  robots: { index: false, follow: false },
};

export default async function AdminMediaPage() {
  const [result, diagnostics] = await Promise.all([listMedia(), getSystemDiagnostics()]);
  const existingPhotos = listExistingPhotos();

  return (
    <div className="mx-auto max-w-6xl px-gutter py-2xl">
      <h1 className="text-h2 text-plum">Media Library</h1>
      <p className="mt-2xs text-small text-charcoal/70">
        Two kinds of photography live here: the studio&apos;s original,
        already-approved photography (below, read-only — its metadata lives in
        code, not this database) and anything uploaded through the form below,
        which becomes available to its matching portfolio page and, if marked
        Featured, the homepage.
      </p>

      {!diagnostics.mediaStorageConfigured ? (
        <div className="mt-lg border border-dashed border-taupe/40 bg-white p-lg text-small text-taupe">
          <p className="font-medium text-charcoal">Photo storage isn&apos;t configured yet.</p>
          <p className="mt-2">
            Uploads will fail until it is. See Site Settings for exactly what&apos;s needed —
            this page is otherwise ready to use immediately once that&apos;s set.
          </p>
        </div>
      ) : !diagnostics.mediaStorageConnected ? (
        <div className="mt-lg border border-dashed border-taupe/40 bg-white p-lg text-small text-taupe">
          <p className="font-medium text-charcoal">Photo storage is configured but not reachable.</p>
          <p className="mt-2">See Site Settings for the likely cause.</p>
        </div>
      ) : null}

      <div className="mt-lg border border-taupe/20 bg-white p-6">
        <h2 className="text-caption font-medium tracking-eyebrow text-taupe uppercase">Upload Photos</h2>
        <div className="mt-4">
          <UploadMediaForm />
        </div>
      </div>

      <div className="mt-lg">
        <h2 className="text-h4 text-plum">Uploaded Library</h2>
        <p className="mt-1 text-caption text-charcoal/60">
          Stored in Supabase Storage; metadata below is editable and drives the
          matching portfolio page / homepage Featured Work directly.
        </p>
        {!result.configured ? (
          <div className="mt-4 border border-dashed border-taupe/40 bg-white p-lg text-small text-taupe">
            Firebase Admin credentials aren&apos;t configured in this environment yet.
          </div>
        ) : result.assets.length === 0 ? (
          <div className="mt-4 border border-dashed border-taupe/40 bg-white p-lg text-small text-taupe">
            No photos uploaded yet.
          </div>
        ) : (
          <MediaLibraryGrid assets={result.assets} />
        )}
      </div>

      <div className="mt-2xl">
        <h2 className="text-h4 text-plum">Existing Approved Photography</h2>
        <p className="mt-1 text-caption text-charcoal/60">
          The site&apos;s original, client-supplied photography already live on
          the public portfolio pages. Read-only here — its metadata is
          code-controlled (reviewed like any other code change), not a database
          row, so it can&apos;t be edited or deleted from this page. Nothing
          here is stored in Supabase.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {existingPhotos.map((photo) => (
            <ExistingPhotoCard key={photo.id} photo={photo} />
          ))}
        </div>
      </div>
    </div>
  );
}
