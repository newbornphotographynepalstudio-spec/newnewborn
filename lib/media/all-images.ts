import { newbornGallery } from "@/lib/media/newborn-gallery";
import { cakeSmashGallery } from "@/lib/media/cake-smash-gallery";

/** Every approved, web-optimized image already in the project, for
 * pickers (e.g. the blog post featured-image field) that should only
 * ever reference existing, vetted photography — never an uploaded file,
 * since Firebase Storage isn't provisioned for this project yet. */
export const allGalleryImages = [...newbornGallery, ...cakeSmashGallery];

export function findGalleryImage(id: string | undefined) {
  if (!id) return undefined;
  return allGalleryImages.find((img) => img.id === id);
}
