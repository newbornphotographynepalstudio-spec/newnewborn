import type { Metadata } from "next";

import { MediaCard } from "@/components/sections/admin/MediaCard";
import { UploadMediaForm } from "@/components/sections/admin/UploadMediaForm";
import { listMedia } from "@/lib/media/library-data";
import { getSystemDiagnostics } from "@/lib/settings/diagnostics";

export const metadata: Metadata = {
  title: "Media Library",
  robots: { index: false, follow: false },
};

export default async function AdminMediaPage() {
  const [result, diagnostics] = await Promise.all([listMedia(), getSystemDiagnostics()]);

  return (
    <div className="mx-auto max-w-6xl px-gutter py-2xl">
      <h1 className="text-h2 text-plum">Media Library</h1>
      <p className="mt-2xs text-small text-charcoal/70">
        Upload and manage photos. Uploaded photos aren&apos;t shown on the public site yet — the
        existing approved galleries remain live; this is where new photography will be added.
      </p>

      {!diagnostics.storageEnabled ? (
        <div className="mt-lg border border-dashed border-taupe/40 bg-white p-lg text-small text-taupe">
          <p className="font-medium text-charcoal">Firebase Storage isn&apos;t enabled yet.</p>
          <p className="mt-2">
            Uploads will fail until it is. Enable it once in the Firebase Console: Storage → Get
            Started. No code changes are needed afterward — this page is ready to use immediately.
          </p>
        </div>
      ) : null}

      <div className="mt-lg border border-taupe/20 bg-white p-6">
        <h2 className="text-caption font-medium tracking-eyebrow text-taupe uppercase">Upload a Photo</h2>
        <div className="mt-4">
          <UploadMediaForm />
        </div>
      </div>

      <div className="mt-lg">
        <h2 className="text-h4 text-plum">Library</h2>
        {!result.configured ? (
          <div className="mt-4 border border-dashed border-taupe/40 bg-white p-lg text-small text-taupe">
            Firebase Admin credentials aren&apos;t configured in this environment yet.
          </div>
        ) : result.assets.length === 0 ? (
          <div className="mt-4 border border-dashed border-taupe/40 bg-white p-lg text-small text-taupe">
            No photos uploaded yet.
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {result.assets.map((asset) => (
              <MediaCard key={asset.id} asset={asset} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
