import Link from "next/link";
import type { ImageProps } from "next/image";

import { EditorialImage } from "@/components/ui/EditorialImage";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Photo-forward category card for the homepage Services Overview and
 * similar category-listing spots — real photography first, then a short
 * name/description, matching the "photography-first" redesign direction
 * (see docs/DESIGN-SYSTEM.md). When no approved photo exists yet for a
 * category (Maternity/Baby/Family currently have none — see
 * lib/media/newborn-gallery.ts / cake-smash-gallery.ts / the Media
 * Library), renders a quiet, honest "gallery being curated" state instead
 * of a fake placeholder graphic — never invented photography.
 */
export function ServiceCategoryCard({
  name,
  description,
  href,
  image,
  imageAlt,
  featured,
  delay = 0,
}: {
  name: string;
  description: string;
  href: string;
  image?: ImageProps["src"];
  imageAlt?: string;
  featured?: boolean;
  delay?: number;
}) {
  return (
    <Reveal delay={delay}>
      <Link href={href} className="group block">
        {image ? (
          <EditorialImage
            src={image}
            alt={imageAlt ?? name}
            aspect="portrait"
            sizes="(min-width: 1024px) 20vw, 45vw"
            rounded
            className="transition-opacity duration-base group-hover:opacity-90"
          />
        ) : (
          <div className="flex aspect-[4/5] w-full items-center justify-center rounded-sm border border-taupe/25 bg-blush/40 px-4 text-center">
            <p className="text-caption leading-relaxed text-charcoal/60">
              Gallery being curated
            </p>
          </div>
        )}
        <div className="mt-4">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-h4 text-plum transition-colors duration-base group-hover:text-charcoal">
              {name}
            </h3>
            {featured ? (
              <span className="shrink-0 text-caption tracking-eyebrow text-taupe uppercase">
                Core Service
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-small leading-relaxed text-charcoal/70">{description}</p>
        </div>
      </Link>
    </Reveal>
  );
}
