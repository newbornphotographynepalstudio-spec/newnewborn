import "server-only";

import { newbornGallery } from "@/lib/media/newborn-gallery";
import { cakeSmashGallery } from "@/lib/media/cake-smash-gallery";
import type { MediaAsset } from "@/lib/media/types";

export type ExistingPhoto = MediaAsset & {
  /** Where this photo's metadata actually lives in the codebase — shown
   * in the admin so it's clear this isn't a database row that can be
   * edited from here. */
  sourceFile: string;
};

/**
 * The site's original, already-approved, client-supplied photography —
 * `newbornGallery` (6 images) and `cakeSmashGallery` (5 images), the only
 * two galleries that exist (maternity/baby/family have no static photos
 * yet; those categories show an honest empty state on the public site
 * until real client photography is supplied). Read-only by design: this
 * metadata is code-controlled, reviewed in a PR when it changes, not a
 * Firestore document — see docs/ARCHITECTURE.md, "Image / photography
 * architecture."
 */
export function listExistingPhotos(): ExistingPhoto[] {
  return [
    ...newbornGallery.map((img) => ({ ...img, sourceFile: "lib/media/newborn-gallery.ts" })),
    ...cakeSmashGallery.map((img) => ({ ...img, sourceFile: "lib/media/cake-smash-gallery.ts" })),
  ];
}
