import { googleReviewsUrl } from "@/lib/data/reviews";
import { siteConfig } from "@/lib/seo/site";

/**
 * Structured-data builders. Only schema properties backed by real,
 * already-known business information are ever included — no invented
 * rating, review, price, address or certification. Add a field only when
 * a real value exists for it.
 */

export function organizationJsonLd(nameOverride?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: nameOverride || siteConfig.name,
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
export function professionalServiceJsonLd(
  aggregateRating?: { ratingValue: number; reviewCount: number },
  nameOverride?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: nameOverride || siteConfig.name,
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
 * BlogPosting for one published post — every field comes from the post
 * document itself (title, excerpt, author, publish/update dates); there
 * is no invented field here (no fake `datePublished` for a draft, since
 * this is only ever called with an already-published post).
 */
export function blogPostingJsonLd(post: {
  title: string;
  excerpt: string;
  author: string;
  slug: string;
  publishedAt?: string;
  updatedAt: string;
}) {
  const url = new URL(`/blog/${post.slug}/`, siteConfig.url).toString();
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || undefined,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
    url,
    mainEntityOfPage: url,
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    dateModified: post.updatedAt,
  };
}

/**
 * FAQPage — built from the exact same question/answer pairs already
 * rendered on the page (lib/faq/data.ts), never a separate hand-written
 * set that could drift from what a visitor actually sees.
 */
export function faqPageJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
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
