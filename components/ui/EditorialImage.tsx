import Image, { type ImageProps } from "next/image";

export type ImageAspect = "portrait" | "landscape" | "square" | "auto";
export type ImageFit = "cover" | "contain";
export type ImagePosition =
  | "center"
  | "top"
  | "bottom"
  | "left"
  | "right";

const aspectClass: Record<Exclude<ImageAspect, "auto">, string> = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[3/2]",
  square: "aspect-square",
};

const fitClass: Record<ImageFit, string> = {
  cover: "object-cover",
  contain: "object-contain",
};

const positionClass: Record<ImagePosition, string> = {
  center: "object-center",
  top: "object-top",
  bottom: "object-bottom",
  left: "object-left",
  right: "object-right",
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
 * - Full-resolution originals are never referenced here directly — `src`
 *   is expected to already be an optimized/derivative URL (see
 *   docs/DESIGN-SYSTEM.md, Image rules).
 */
export function EditorialImage({
  src,
  alt,
  aspect = "landscape",
  fit = "cover",
  position = "center",
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  blurDataURL,
  rounded = false,
  className = "",
}: {
  src: ImageProps["src"];
  alt: string;
  aspect?: ImageAspect;
  fit?: ImageFit;
  position?: ImagePosition;
  priority?: boolean;
  sizes?: string;
  blurDataURL?: string;
  rounded?: boolean;
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

  return (
    <div
      className={`relative overflow-hidden ${aspectClass[aspect]} ${radiusClass} ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder={hasBlur ? "blur" : "empty"}
        blurDataURL={blurDataURL}
        className={`${fitClass[fit]} ${positionClass[position]}`}
      />
    </div>
  );
}
