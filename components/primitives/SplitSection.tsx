import type { ReactNode } from "react";
import type { ImageProps } from "next/image";

import { ImageText } from "@/components/primitives/ImageText";
import { Section } from "@/components/primitives/Section";
import type { ImageAspect } from "@/components/ui/EditorialImage";

/**
 * The common "full section, split image/text" pattern — Section + ImageText
 * with sensible defaults. Use ImageText directly instead when the image/text
 * pairing needs to live inside a larger composition rather than as its own
 * section.
 */
export function SplitSection({
  image,
  imageAlt,
  imageAspect,
  imageSide = "left",
  ratio,
  tone = "none",
  children,
}: {
  image: ImageProps["src"];
  imageAlt: string;
  imageAspect?: ImageAspect;
  imageSide?: "left" | "right";
  ratio?: "even" | "wide-image" | "wide-text";
  tone?: "ivory" | "blush" | "plum" | "none";
  children: ReactNode;
}) {
  return (
    <Section tone={tone} containerSize="wide">
      <ImageText
        image={image}
        imageAlt={imageAlt}
        imageAspect={imageAspect}
        imageSide={imageSide}
        ratio={ratio}
      >
        {children}
      </ImageText>
    </Section>
  );
}
