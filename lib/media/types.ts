import type { ImageProps } from "next/image";

import type { ImageAspect, ImagePosition } from "@/components/ui/EditorialImage";

export type Orientation = "portrait" | "landscape" | "square";

export type MediaCategory =
  | "newborn"
  | "cake-smash"
  | "family"
  | "heritage"
  | "detail"
  | "setup";

export type MediaService =
  | "newborn"
  | "maternity"
  | "baby"
  | "cake-smash"
  | "family"
  | "training";

/**
 * One real photograph, with everything a component needs to render it
 * correctly (crop, alt text) and everything an editor needs to decide
 * where it's allowed to appear. Every field describes what's actually in
 * the photo — nothing here is inferred or invented.
 */
export type MediaAsset = {
  id: string;
  src: ImageProps["src"];
  width: number;
  height: number;
  orientation: Orientation;
  /** Plain, factual description of what's visible — the <img alt>. */
  alt: string;
  /** Short human title, e.g. for a lightbox caption. Optional. */
  title?: string;
  category: MediaCategory;
  service: MediaService;
  /** Sensible default crop for EditorialImage when no override is given.
   * Never "auto" — these are remote-shaped photos rendered via `fill`,
   * not local static imports rendered at intrinsic size. */
  desktopAspect: Exclude<ImageAspect, "auto">;
  mobileAspect: Exclude<ImageAspect, "auto">;
  objectPosition: ImagePosition;
  /** One-sentence description usable as an OG/SEO image description. */
  seoDescription: string;
  homepageApproved: boolean;
  portfolioApproved: boolean;
};
