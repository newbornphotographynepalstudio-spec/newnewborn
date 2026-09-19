import { findGalleryImage } from "@/lib/media/all-images";
import { getMediaById } from "@/lib/media/library-data";

/** Every gallery image `findGalleryImage` can return is a static import
 * (see lib/media/all-images.ts), so `.src` is always a real
 * `StaticImageData` object at runtime — but callers sometimes need a
 * plain URL string (OG image, JSON-LD image, a plain <img> src). */
function resolveImageUrl(src: unknown): string | undefined {
  if (!src) return undefined;
  if (typeof src === "string") return src;
  if (typeof src === "object" && "src" in src && typeof src.src === "string") return src.src;
  return undefined;
}

/**
 * A post's `featuredImageId` (SEO Phase 11) can be either one of the two
 * approved static galleries (newborn/cake-smash — `findGalleryImage`) or
 * a real, published Media Library photo's Firestore doc id. Checks the
 * static galleries first (cheap, no request), then falls back to a
 * single Firestore read only when the id isn't a static-gallery id.
 * Real photos only — never a placeholder, and a Media Library photo is
 * only used if it's actually marked `published`.
 *
 * Shared by both the blog detail page and the blog listing page (SEO
 * Phase 16) — the listing page previously only checked the static
 * galleries directly, so a post whose featured image lived only in the
 * Media Library (e.g. the maternity article's real photo) rendered
 * correctly on its own page but showed no thumbnail at all on /blog/.
 */
export async function resolveFeaturedImage(
  id: string | undefined
): Promise<{ src: string; alt: string } | undefined> {
  if (!id) return undefined;
  const staticImage = findGalleryImage(id);
  if (staticImage) return { src: resolveImageUrl(staticImage.src) ?? "", alt: staticImage.alt };
  const asset = await getMediaById(id);
  if (asset && asset.published) return { src: asset.url, alt: asset.alt };
  return undefined;
}
