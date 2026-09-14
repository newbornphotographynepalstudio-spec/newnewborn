import type { Metadata } from "next";

import { newbornGallery } from "@/lib/media/newborn-gallery";
import { cakeSmashGallery } from "@/lib/media/cake-smash-gallery";
import { getSystemDiagnostics } from "@/lib/settings/diagnostics";

export const metadata: Metadata = {
  title: "Portfolio Photos",
  robots: { index: false, follow: false },
};

export default async function AdminPortfolioPage() {
  const diagnostics = await getSystemDiagnostics();

  return (
    <div className="mx-auto max-w-6xl px-gutter py-2xl">
      <h1 className="text-h2 text-plum">Portfolio Photos</h1>
      <p className="mt-2xs text-small text-charcoal/70">
        Every approved photo currently used on the public site.
      </p>

      {!diagnostics.storageEnabled ? (
        <div className="mt-lg border border-dashed border-taupe/40 bg-white p-lg text-small text-taupe">
          <p className="font-medium text-charcoal">Uploading new photos from here isn&apos;t available yet.</p>
          <p className="mt-2">
            Firebase Storage isn&apos;t enabled on this project (checked live: no storage bucket
            exists). To turn on photo uploads: Firebase Console → Storage → Get Started, using
            the default security rules prompt. No code changes are needed once it&apos;s on, this
            page is ready to be extended with an upload form.
          </p>
          <p className="mt-2">
            The photos below are the studio&apos;s existing, already web-optimized photography,
            stored as static files and shown exactly as approved. Their titles, alt text and
            category come from the codebase, not a database, so editing them currently requires
            a code change rather than this screen, until Storage-backed uploads replace this
            static list.
          </p>
        </div>
      ) : null}

      <GalleryTable title="Newborn Gallery" images={newbornGallery} />
      <GalleryTable title="Cake Smash Gallery" images={cakeSmashGallery} />
    </div>
  );
}

function GalleryTable({
  title,
  images,
}: {
  title: string;
  images: { id: string; title?: string; alt: string; category: string; homepageApproved: boolean; portfolioApproved: boolean }[];
}) {
  return (
    <div className="mt-lg">
      <h2 className="text-h4 text-plum">{title}</h2>
      <div className="mt-4 overflow-x-auto border border-taupe/20 bg-white">
        <table className="w-full min-w-[720px] text-left text-small">
          <thead className="border-b border-taupe/20 text-caption tracking-eyebrow text-taupe uppercase">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Alt Text</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Homepage</th>
              <th className="px-4 py-3">Portfolio</th>
            </tr>
          </thead>
          <tbody>
            {images.map((img) => (
              <tr key={img.id} className="border-b border-taupe/10 last:border-b-0">
                <td className="px-4 py-3 font-mono text-caption text-charcoal/70">{img.id}</td>
                <td className="max-w-md px-4 py-3 text-charcoal/80">{img.alt}</td>
                <td className="px-4 py-3 text-charcoal/80">{img.category}</td>
                <td className="px-4 py-3 text-charcoal/60">{img.homepageApproved ? "Yes" : ""}</td>
                <td className="px-4 py-3 text-charcoal/60">{img.portfolioApproved ? "Yes" : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
