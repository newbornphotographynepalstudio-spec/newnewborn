"use client";

import type { ImageProps } from "next/image";

import { EditorialImage, type ImageAspect, type ImagePosition } from "@/components/ui/EditorialImage";
import { useLightbox } from "@/components/gallery/LightboxRoot";

/**
 * Drop-in replacement for `EditorialImage` inside a `LightboxRoot` —
 * same visual output, wrapped in a button that opens the full-screen
 * viewer at this exact photo. Must be rendered somewhere inside a
 * `LightboxRoot` (see its doc comment).
 */
export function LightboxImage({
  src,
  alt,
  aspect,
  mobileAspect,
  position,
  mobilePosition,
  sizes,
  rounded,
  priority,
  className,
}: {
  src: ImageProps["src"];
  alt: string;
  aspect?: ImageAspect;
  mobileAspect?: Exclude<ImageAspect, "auto">;
  position?: ImagePosition;
  mobilePosition?: ImagePosition;
  sizes?: string;
  rounded?: boolean;
  priority?: boolean;
  className?: string;
}) {
  const { open } = useLightbox();

  return (
    <button
      type="button"
      onClick={() => open(src)}
      aria-label={`View larger: ${alt}`}
      className="block w-full cursor-zoom-in text-left"
    >
      <EditorialImage
        src={src}
        alt={alt}
        aspect={aspect}
        mobileAspect={mobileAspect}
        position={position}
        mobilePosition={mobilePosition}
        sizes={sizes}
        rounded={rounded}
        priority={priority}
        className={className}
      />
    </button>
  );
}
