import type { ImageProps } from "next/image";

import { Cluster } from "@/components/primitives/Cluster";
import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/ui/Button";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { PageHero } from "@/components/ui/PageHero";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import type { PortfolioCategory } from "@/lib/data/portfolio";
import { bookASessionCta, routes } from "@/lib/navigation/routes";

/**
 * Shared shell for each /portfolio/{category}/ page. `featuredImage` is
 * only passed for newborn (the one approved, category-matching photo);
 * every other category shows the honest GalleryGrid empty state rather
 * than a stand-in photo.
 */
export function PortfolioCategoryLayout({
  category,
  featuredImage,
  featuredAlt,
}: {
  category: PortfolioCategory;
  featuredImage?: ImageProps["src"];
  featuredAlt?: string;
}) {
  return (
    <>
      <PageHero eyebrow="Portfolio" title={`${category.name} Portfolio`}>
        <Cluster gap="sm" className="mt-8">
          <Button href={bookASessionCta.href}>{bookASessionCta.label}</Button>
          <Button href={category.serviceHref} variant="secondary">
            {category.name} Photography
          </Button>
        </Cluster>
      </PageHero>

      {featuredImage ? (
        <Section>
          <EditorialImage src={featuredImage} alt={featuredAlt ?? category.name} aspect="wide" rounded />
        </Section>
      ) : null}

      <Section tone={featuredImage ? "blush" : "ivory"}>
        <GalleryGrid
          images={[]}
          emptyMessage={`More from the ${category.name.toLowerCase()} portfolio is being added.`}
        />
      </Section>

      <Section compact>
        <Button href={routes.portfolio} variant="text">
          ← All Portfolio Categories
        </Button>
      </Section>
    </>
  );
}
