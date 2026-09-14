import Link from "next/link";
import type { Metadata } from "next";

import { newbornGallery } from "@/lib/media/newborn-gallery";
import { cakeSmashGallery } from "@/lib/media/cake-smash-gallery";
import { listMedia } from "@/lib/media/library-data";
import { MEDIA_CATEGORIES } from "@/lib/media/library-types";

export const metadata: Metadata = {
  title: "Portfolio Photos",
  robots: { index: false, follow: false },
};

export default async function AdminPortfolioPage() {
  const result = await listMedia();
  const cmsAssets = result.configured ? result.assets : [];

  return (
    <div className="mx-auto max-w-6xl px-gutter py-2xl">
      <h1 className="text-h2 text-plum">Portfolio Photos</h1>
      <p className="mt-2xs text-small text-charcoal/70">
        Every approved photo currently used on the public site.
      </p>

      <div className="mt-lg border border-dashed border-taupe/40 bg-white p-lg text-small text-taupe">
        <p className="font-medium text-charcoal">
          The tables below are the studio&apos;s original, already web-optimized photography,
          stored as static files and shown exactly as approved — never altered here.
        </p>
        <p className="mt-2">
          Uploaded photos are managed separately in{" "}
          <Link href="/admin/media" className="text-plum hover:underline">
            Media Library
          </Link>
          . A photo uploaded there and assigned a category <strong>does</strong> appear on the
          matching public portfolio page (below the sections shown here), and on the homepage
          Featured Work section if marked Featured — additive to this approved selection, never
          replacing it.
        </p>
        {result.configured ? (
          <p className="mt-3 text-caption text-charcoal/60">
            Uploaded, published photos per portfolio category:{" "}
            {MEDIA_CATEGORIES.filter((c) => c !== "other")
              .map((c) => `${c}: ${cmsAssets.filter((a) => a.category === c && a.published).length}`)
              .join(" · ")}
          </p>
        ) : null}
      </div>

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
