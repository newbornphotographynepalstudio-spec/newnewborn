import type { ReactNode } from "react";
import type { ImageProps } from "next/image";

import { EditorialImage, type ImageAspect } from "@/components/ui/EditorialImage";

/**
 * A two-part image + text composition. Standalone (unlike SplitSection,
 * which wraps this in a full Section) — use ImageText directly when you
 * want the pairing inline within a larger composition, e.g. inside an
 * EditorialGrid.
 */
export function ImageText({
  image,
  imageAlt,
  imageAspect = "portrait",
  imageSide = "left",
  ratio = "even",
  children,
  className = "",
}: {
  image: ImageProps["src"];
  imageAlt: string;
  imageAspect?: ImageAspect;
  imageSide?: "left" | "right";
  /** "even" = 50/50. "wide-image" and "wide-text" bias the split. */
  ratio?: "even" | "wide-image" | "wide-text";
  children: ReactNode;
  className?: string;
}) {
  const columns = {
    even: "lg:grid-cols-2",
    "wide-image": "lg:grid-cols-5",
    "wide-text": "lg:grid-cols-5",
  }[ratio];

  const imageSpan =
    ratio === "wide-image"
      ? "lg:col-span-3"
      : ratio === "wide-text"
        ? "lg:col-span-2"
        : "";
  const textSpan =
    ratio === "wide-image"
      ? "lg:col-span-2"
      : ratio === "wide-text"
        ? "lg:col-span-3"
        : "";

  const imageOrder = imageSide === "right" ? "lg:order-2" : "";

  return (
    <div className={`grid grid-cols-1 items-center gap-8 lg:gap-16 ${columns} ${className}`}>
      <div className={`${imageSpan} ${imageOrder}`}>
        <EditorialImage src={image} alt={imageAlt} aspect={imageAspect} />
      </div>
      <div className={textSpan}>{children}</div>
    </div>
  );
}
