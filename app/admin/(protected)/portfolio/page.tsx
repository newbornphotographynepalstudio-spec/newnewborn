import Link from "next/link";
import type { Metadata } from "next";

import { newbornGallery } from "@/lib/media/newborn-gallery";
import { cakeSmashGallery } from "@/lib/media/cake-smash-gallery";
import { listMedia } from "@/lib/media/library-data";
import { MEDIA_CATEGORIES } from "@/lib/media/library-types";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Card } from "@/components/admin/ui/Card";
import { Table, TableHead, Th, TableBody, Tr, Td } from "@/components/admin/ui/Table";
import { InfoIcon } from "@/components/admin/ui/icons";

export const metadata: Metadata = {
  title: "Portfolio Photos",
  robots: { index: false, follow: false },
};

export default async function AdminPortfolioPage() {
  const result = await listMedia();
  const cmsAssets = result.configured ? result.assets : [];

  return (
    <div>
      <PageHeader title="Portfolio Photos" description="Every approved photo currently used on the public site." />

      <Card className="mb-8 flex items-start gap-3 p-5">
        <InfoIcon width={18} height={18} className="mt-0.5 shrink-0 text-slate-400" />
        <div className="text-sm text-slate-600">
          <p className="font-medium text-slate-900">
            The tables below are the studio&apos;s original, already web-optimized photography, stored as
            static files and shown exactly as approved — never altered here.
          </p>
          <p className="mt-2">
            Uploaded photos are managed separately in{" "}
            <Link href="/admin/media" className="text-plum hover:underline">
              Media Library
            </Link>
            . A photo uploaded there and assigned a category <strong>does</strong> appear on the matching
            public portfolio page (below the sections shown here), and on the homepage Featured Work section
            if marked Featured — additive to this approved selection, never replacing it.
          </p>
          {result.configured ? (
            <p className="mt-3 text-xs text-slate-500">
              Uploaded, published photos per portfolio category:{" "}
              {MEDIA_CATEGORIES.filter((c) => c !== "other")
                .map((c) => `${c}: ${cmsAssets.filter((a) => a.category === c && a.published).length}`)
                .join(" · ")}
            </p>
          ) : null}
        </div>
      </Card>

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
    <div className="mb-8">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">{title}</h2>
      <Table minWidth={640}>
        <TableHead>
          <Th>ID</Th>
          <Th>Alt Text</Th>
          <Th>Category</Th>
          <Th>Homepage</Th>
          <Th>Portfolio</Th>
        </TableHead>
        <TableBody>
          {images.map((img) => (
            <Tr key={img.id}>
              <Td className="font-mono text-xs text-slate-400">{img.id}</Td>
              <Td className="max-w-md">{img.alt}</Td>
              <Td>{img.category}</Td>
              <Td className="text-slate-400">{img.homepageApproved ? "Yes" : ""}</Td>
              <Td className="text-slate-400">{img.portfolioApproved ? "Yes" : ""}</Td>
            </Tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
