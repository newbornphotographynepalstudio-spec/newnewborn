import type { ImageProps } from "next/image";

import { Cluster } from "@/components/primitives/Cluster";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/ui/Button";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { PageHero } from "@/components/ui/PageHero";
import type { PortfolioCategory } from "@/lib/data/portfolio";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { bookASessionCta, routes } from "@/lib/navigation/routes";

/**
 * Shared shell for each /portfolio/{category}/ page. `featuredImage` is
 * only passed for newborn (the one approved, category-matching photo);
 * every other category shows an honest, elegantly-framed empty state
 * (bordered card + a real CTA to the portfolio/booking) rather than a
 * stand-in photo or a bare line of unstyled text sitting in an otherwise
 * empty section — found via visual inspection that the plain-text
 * version read as a broken/unfinished page, not an intentional one.
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
  const jsonLd = breadcrumbJsonLd([
    { name: "Portfolio", href: routes.portfolio },
    { name: category.name, href: category.href },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
        <Reveal>
          <div className="mx-auto max-w-xl border border-taupe/25 bg-white px-8 py-10 text-center">
            <p className="text-small leading-relaxed text-charcoal/75">
              A dedicated {category.name.toLowerCase()} gallery is being
              curated. In the meantime, real sessions from the studio — the
              same space, lighting and team — are in the newborn and cake
              smash portfolios.
            </p>
            <Cluster gap="sm" align="center" justify="center" className="mt-5">
              <Button href={routes.portfolio} variant="text">
                View the Portfolio
              </Button>
              <Button href={bookASessionCta.href} variant="text">
                {bookASessionCta.label}
              </Button>
            </Cluster>
          </div>
        </Reveal>
      </Section>

      <Section compact>
        <Button href={routes.portfolio} variant="text">
          ← All Portfolio Categories
        </Button>
      </Section>
    </>
  );
}
