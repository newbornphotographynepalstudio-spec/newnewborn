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
 * genuinely what this is. No `address` (no street address has been
 * supplied), no `telephone`, no `priceRange`, no `aggregateRating` — all
 * would be invented.
 */
export function professionalServiceJsonLd() {
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
