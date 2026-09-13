import Image, { type ImageProps } from "next/image";
import type { ReactNode } from "react";

export type ImageAspect = "portrait" | "landscape" | "wide" | "square" | "auto";
export type ImageFit = "cover" | "contain";
export type ImagePosition =
  | "center"
  | "top"
  | "bottom"
  | "left"
  | "right";

/** Base (mobile-first) aspect-ratio utility for each option. */
const aspectClassBase: Record<Exclude<ImageAspect, "auto">, string> = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[3/2]",
  wide: "aspect-[16/9]",
  square: "aspect-square",
};

/** `lg:`-prefixed variant of the same scale, for art-directed crops that
 * change aspect ratio at the desktop breakpoint (see `mobileAspect`). */
const aspectClassLg: Record<Exclude<ImageAspect, "auto">, string> = {
  portrait: "lg:aspect-[4/5]",
  landscape: "lg:aspect-[3/2]",
  wide: "lg:aspect-[16/9]",
  square: "lg:aspect-square",
};

const fitClass: Record<ImageFit, string> = {
  cover: "object-cover",
  contain: "object-contain",
};

const positionClassBase: Record<ImagePosition, string> = {
  center: "object-center",
  top: "object-top",
  bottom: "object-bottom",
  left: "object-left",
  right: "object-right",
};

const positionClassLg: Record<ImagePosition, string> = {
  center: "lg:object-center",
  top: "lg:object-top",
  bottom: "lg:object-bottom",
  left: "lg:object-left",
  right: "lg:object-right",
};

/**
 * The one image-rendering primitive the whole site uses — every other
 * image pattern (hero, thumbnail, gallery item, full-bleed) is this
 * component with different props, not a separate implementation.
 *
 * - `aspect="auto"` renders at the image's intrinsic size (only meaningful
 *   for a local static import, which carries width/height) — used for
 *   things like the logo. Any other aspect uses `fill` inside a ratio-
 *   locked box, which is how responsive, never-stretched photography works
 *   for remote (Firebase Storage) sources whose intrinsic size isn't known
 *   at build time.
 * - **Art direction**: pass `mobileAspect`/`mobilePosition` to render a
 *   different aspect ratio and/or focal point below the `lg` breakpoint
 *   than above it — e.g. a tall portrait crop on mobile, wide on desktop —
 *   from the *same* unaltered source image (never a separately-cropped
 *   file). `aspect`/`position` become the desktop (`lg:`) values whenever
 *   a mobile override is given. Use this instead of guessing a single
 *   crop that has to work at every width.
 * - Full-resolution originals are never referenced here directly — `src`
 *   is expected to already be an optimized/derivative URL (see
 *   docs/DESIGN-SYSTEM.md, Image rules).
 * - `overlay` renders content (e.g. a gradient scrim + hero copy)
 *   absolutely positioned inside the same aspect-ratio box as the image —
 *   for the "text in the photograph's negative space" editorial pattern,
 *   without a separate component reimplementing the image box.
 */
export function EditorialImage({
  src,
  alt,
  aspect = "landscape",
  mobileAspect,
  fit = "cover",
  position = "center",
  mobilePosition,
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  blurDataURL,
  rounded = false,
  overlay,
  className = "",
}: {
  src: ImageProps["src"];
  alt: string;
  aspect?: ImageAspect;
  /** Mobile/base aspect ratio, if it should differ from `aspect`. */
  mobileAspect?: Exclude<ImageAspect, "auto">;
  fit?: ImageFit;
  position?: ImagePosition;
  /** Mobile/base focal point, if it should differ from `position`. */
  mobilePosition?: ImagePosition;
  priority?: boolean;
  sizes?: string;
  blurDataURL?: string;
  rounded?: boolean;
  overlay?: ReactNode;
  className?: string;
}) {
  const isStaticImport = typeof src === "object";
  const hasBlur = Boolean(blurDataURL) || isStaticImport;
  const radiusClass = rounded ? "rounded-md" : "";

  if (aspect === "auto") {
    return (
      <Image
        src={src}
        alt={alt}
        priority={priority}
        placeholder={hasBlur ? "blur" : "empty"}
        blurDataURL={blurDataURL}
        className={`h-auto w-full ${radiusClass} ${className}`}
      />
    );
  }

  const aspectClasses = mobileAspect
    ? `${aspectClassBase[mobileAspect]} ${aspectClassLg[aspect]}`
    : aspectClassBase[aspect];

  const positionClasses = mobilePosition
    ? `${positionClassBase[mobilePosition]} ${positionClassLg[position]}`
    : positionClassBase[position];

  return (
    <div
      className={`relative overflow-hidden ${aspectClasses} ${radiusClass} ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder={hasBlur ? "blur" : "empty"}
        blurDataURL={blurDataURL}
        className={`${fitClass[fit]} ${positionClasses}`}
      />
      {overlay}
    </div>
  );
}
