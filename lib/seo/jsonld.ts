import { googleReviewsUrl } from "@/lib/data/reviews";
import { siteConfig } from "@/lib/seo/site";

/**
 * Structured-data builders. Only schema properties backed by real,
 * already-known business information are ever included — no invented
 * rating, review, price, address or certification. Add a field only when
 * a real value exists for it.
 */

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: new URL("/brand/logo.jpg", siteConfig.url).toString(),
    // The real Google Business Profile review link — an identity
    // reference (this Organization also exists at this URL), not review/
    // rating schema. No aggregateRating/reviewCount is added here or
    // anywhere else: no genuine review data has been supplied to this
    // codebase, and that field would have to be invented to populate it.
    sameAs: [googleReviewsUrl],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "en",
  };
}

/**
 * ProfessionalService rather than a plain LocalBusiness, since that's
 * genuinely what this is. No `address`, no `telephone`, no `priceRange`
 * — all would be invented, since none of those facts have been supplied.
 *
 * `aggregateRating` is the one field this function *can* populate, but
 * only when a caller passes real, freshly-fetched data (see
 * lib/reviews/google-places.ts) — never a hardcoded value. Pass nothing
 * (or a zero review count) and the field is omitted entirely, which is
 * the correct behavior whenever live Google review data isn't connected
 * — exactly the current state of this codebase, since no Google API
 * credentials exist in this environment.
 */
export function professionalServiceJsonLd(aggregateRating?: { ratingValue: number; reviewCount: number }) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.name,
    url: siteConfig.url,
    image: new URL("/brand/logo.jpg", siteConfig.url).toString(),
    description: siteConfig.description,
    areaServed: [
      { "@type": "City", name: "Kathmandu" },
      { "@type": "City", name: "Lalitpur" },
      { "@type": "City", name: "Bhaktapur" },
    ],
    ...(aggregateRating && aggregateRating.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: aggregateRating.ratingValue,
            reviewCount: aggregateRating.reviewCount,
          },
        }
      : {}),
  };
}

/**
 * BreadcrumbList for pages that sit two or more levels deep (portfolio
 * sub-galleries, area pages) — purely navigational metadata derived from
 * the same route/label data already shown on the page, never a separate
 * invented hierarchy. `items` excludes Home; it's prepended here so every
 * caller doesn't repeat it.
 */
export function breadcrumbJsonLd(items: { name: string; href: string }[]) {
  const trail = [{ name: "Home", href: "/" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.href, siteConfig.url).toString(),
    })),
  };
}
