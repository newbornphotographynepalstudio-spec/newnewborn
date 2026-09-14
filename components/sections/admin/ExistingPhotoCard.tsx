import Image from "next/image";

import type { ExistingPhoto } from "@/lib/media/existing-photos";

/** Read-only — this metadata is code-controlled (see lib/media/existing-photos.ts),
 * not a Firestore document, so there is nothing here for an admin action to save. */
export function ExistingPhotoCard({ photo }: { photo: ExistingPhoto }) {
  return (
    <div className="border border-taupe/20 bg-white p-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-sm">
        <Image src={photo.src} alt={photo.alt} fill sizes="300px" className="object-cover" />
      </div>

      <span className="mt-2 inline-block rounded-sm bg-stone-soft px-2 py-0.5 text-caption font-medium tracking-eyebrow text-charcoal/70 uppercase">
        Existing / Approved
      </span>

      <dl className="mt-2 space-y-1 text-caption text-charcoal/70">
        <div>
          <dt className="inline font-medium text-charcoal">Title: </dt>
          <dd className="inline">{photo.title || "—"}</dd>
        </div>
        <div>
          <dt className="inline font-medium text-charcoal">Category: </dt>
          <dd className="inline">{photo.category}</dd>
        </div>
        <div>
          <dt className="inline font-medium text-charcoal">Portfolio: </dt>
          <dd className="inline">{photo.service}</dd>
        </div>
        <div>
          <dt className="font-medium text-charcoal">Alt text:</dt>
          <dd>{photo.alt}</dd>
        </div>
        <div>
          <dt className="inline font-medium text-charcoal">Source: </dt>
          <dd className="inline break-all">{photo.sourceFile} (id: {photo.id})</dd>
        </div>
      </dl>
    </div>
  );
}
