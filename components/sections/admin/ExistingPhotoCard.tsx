import Image from "next/image";

import type { ExistingPhoto } from "@/lib/media/existing-photos";
import { Card } from "@/components/admin/ui/Card";
import { Badge } from "@/components/admin/ui/Badge";

/** Read-only — this metadata is code-controlled (see lib/media/existing-photos.ts),
 * not a Firestore document, so there is nothing here for an admin action to save. */
export function ExistingPhotoCard({ photo }: { photo: ExistingPhoto }) {
  return (
    <Card className="overflow-hidden p-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg">
        <Image src={photo.src} alt={photo.alt} fill sizes="300px" className="object-cover" />
      </div>

      <div className="mt-2.5">
        <Badge tone="neutral">Existing / Approved</Badge>
      </div>

      <dl className="mt-2.5 space-y-1 text-xs text-slate-500">
        <div>
          <dt className="inline font-medium text-slate-700">Title: </dt>
          <dd className="inline">{photo.title || "—"}</dd>
        </div>
        <div>
          <dt className="inline font-medium text-slate-700">Category: </dt>
          <dd className="inline">{photo.category}</dd>
        </div>
        <div>
          <dt className="inline font-medium text-slate-700">Portfolio: </dt>
          <dd className="inline">{photo.service}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-700">Alt text:</dt>
          <dd>{photo.alt}</dd>
        </div>
        <div>
          <dt className="inline font-medium text-slate-700">Source: </dt>
          <dd className="inline break-all">
            {photo.sourceFile} (id: {photo.id})
          </dd>
        </div>
      </dl>
    </Card>
  );
}
