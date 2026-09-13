"use client";

import Image from "next/image";

import type { GalleryImage } from "@/lib/gallery/types";

/**
 * Masonry-inspired editorial grid (CSS multi-column — no JS layout pass
 * needed, and it degrades to a single column gracefully). Renders whatever
 * `images` it's given; it never invents placeholder photography, so an
 * empty array renders nothing but the empty state.
 *
 * `onImageClick` is a deliberately thin seam for a future lightbox — this
 * component doesn't implement one.
 */
export function GalleryGrid({
  images,
  onImageClick,
  emptyMessage = "No images yet.",
}: {
  images: GalleryImage[];
  onImageClick?: (image: GalleryImage, index: number) => void;
  emptyMessage?: string;
}) {
  if (images.length === 0) {
    return <p className="text-small text-taupe">{emptyMessage}</p>;
  }

  return (
    <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
      {images.map((image, index) => {
        const isInteractive = Boolean(onImageClick);
        const content = (
          <span className="relative mb-6 block w-full overflow-hidden break-inside-avoid rounded-md bg-blush">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              placeholder={image.blurDataURL ? "blur" : "empty"}
              blurDataURL={image.blurDataURL}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="h-auto w-full object-cover transition-transform duration-slow ease-premium group-hover:scale-[1.03]"
            />
          </span>
        );

        if (!isInteractive) {
          return (
            <figure key={image.id} className="group">
              {content}
              {image.caption ? (
                <figcaption className="mb-6 -mt-3 text-caption text-taupe">
                  {image.caption}
                </figcaption>
              ) : null}
            </figure>
          );
        }

        return (
          <button
            key={image.id}
            type="button"
            onClick={() => onImageClick?.(image, index)}
            className="group block w-full text-left"
            aria-label={`Open ${image.alt}`}
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}
