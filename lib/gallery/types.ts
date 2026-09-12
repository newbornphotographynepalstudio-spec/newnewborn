/**
 * Typed shape for gallery data — no gallery content is hard-coded anywhere;
 * these types are the contract components render against, and the
 * `portfolioGalleries` / `portfolioImages` Firestore collections (see
 * docs/ARCHITECTURE.md) will satisfy them once built in a later phase.
 */

export type GalleryCategory =
  | "newborn"
  | "maternity"
  | "baby"
  | "cake-smash"
  | "family";

export type GalleryImage = {
  id: string;
  /** Optimized/derivative URL — never a full-resolution original. */
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
  caption?: string;
};

export type Gallery = {
  id: string;
  title: string;
  category: GalleryCategory;
  coverImage: GalleryImage;
  images: GalleryImage[];
};
