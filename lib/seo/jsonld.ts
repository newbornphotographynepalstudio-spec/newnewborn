import { contactInfo } from "@/lib/data/contact";
import { googleReviewsUrl } from "@/lib/data/reviews";
import { siteConfig } from "@/lib/seo/site";

/**
 * Structured-data builders. Only schema properties backed by real,
 * already-known business information are ever included — no invented
 * rating, review, price, address or certification. Add a field only when
 * a real value exists for it.
 */

/** The 3 real cities this studio serves (client-confirmed) — shared by
 * every schema type that needs `areaServed`, so the list can't drift
 * between ProfessionalService and per-page Service entries. */
const areaServedCities = [
  { "@type": "City", name: "Kathmandu" },
  { "@type": "City", name: "Lalitpur" },
  { "@type": "City", name: "Bhaktapur" },
];

/**
 * `socialLinks` (optional) are the admin-configured, real profile URLs
 * from Firestore's `settings/site` doc (lib/settings/data.ts) — the same
 * ones the public Footer already renders. Only platforms actually
 * configured there ever appear here; nothing is added for a platform
 * (e.g. YouTube, X/Twitter, LinkedIn) that has no real URL on file, since
 * that would mean fabricating a profile that doesn't exist (SEO Phase 3).
 */
export function organizationJsonLd(
  nameOverride?: string,
  socialLinks?: { href: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: nameOverride || siteConfig.name,
    url: siteConfig.url,
    logo: new URL("/brand/logo.jpg", siteConfig.url).toString(),
    // The real Google Business Profile review link, plus any real
    // admin-configured social profiles — every entry here is an identity
    // reference (this Organization also exists at this URL), not review/
    // rating schema. No aggregateRating/reviewCount is added here or
    // anywhere else: no genuine review data has been supplied to this
    // codebase, and that field would have to be invented to populate it.
    sameAs: [googleReviewsUrl, ...(socialLinks ?? []).map((link) => link.href)],
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
 * genuinely what this is. Still no `address` — that would be invented,
 * since no public street address exists anywhere in this project.
 *
 * `telephone`, `email` and `hasMap` ARE included: all are real,
 * already-verified values already displayed on the live site
 * (lib/data/contact.ts — the same phone/email in the header/footer/
 * contact page, and the client-provided Google Maps link), not new
 * facts introduced here. `hasMap` takes a plain URL per schema.org, so
 * the Maps link is used as-is — it is never decomposed into a
 * fabricated `address` object.
 *
 * `priceRange` (SEO Phase 5) is likewise real: callers pass it computed
 * from the actual published newborn packages (lib/packages/data.ts),
 * never a hardcoded or estimated figure — omitted entirely if a caller
 * doesn't have that data on hand (e.g. a page that never fetched
 * packages), rather than falling back to a guess.
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
  nameOverride?: string,
  priceRange?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: nameOverride || siteConfig.name,
    url: siteConfig.url,
    image: new URL("/brand/logo.jpg", siteConfig.url).toString(),
    description: siteConfig.description,
    telephone: contactInfo.phoneE164,
    email: contactInfo.email,
    hasMap: contactInfo.mapsUrl,
    areaServed: areaServedCities,
    ...(priceRange ? { priceRange } : {}),
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
 * Service — one of this studio's real, distinct session types (newborn,
 * maternity, baby, cake smash, family). `provider` is a minimal reference
 * to the same real business the homepage's ProfessionalService describes
 * (name + url only, not a full re-nested copy of that entity — avoids
 * duplicating the same business data as a separate, competing entity on
 * every service page). `image` is only passed when a real, approved
 * photo exists for that service; omitted otherwise, never a placeholder.
 *
 * `url` and `image` are site-relative paths (e.g. `content.href`, a
 * static import's `.src`) — resolved against `siteConfig.url` here, the
 * same way breadcrumbJsonLd/blogPostingJsonLd already do, so callers
 * never have to construct an absolute URL themselves.
 */
export function serviceJsonLd({
  name,
  description,
  url,
  image,
}: {
  name: string;
  description: string;
  url: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: new URL(url, siteConfig.url).toString(),
    provider: {
      "@type": "ProfessionalService",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    areaServed: areaServedCities,
    ...(image ? { image: new URL(image, siteConfig.url).toString() } : {}),
  };
}

/**
 * BlogPosting for one published post — every field comes from the post
 * document itself (title, excerpt, author, publish/update dates); there
 * is no invented field here (no fake `datePublished` for a draft, since
 * this is only ever called with an already-published post).
 *
 * `author` (SEO Phase 6 fix) now uses the post's own real `author`
 * field — previously hardcoded to `siteConfig.name` regardless of what
 * the admin actually entered, silently diverging from the "By {author}"
 * byline the page itself renders. Still typed `Organization` rather
 * than `Person`, since the data model has no way to know whether a
 * given author string names a person or the studio itself.
 *
 * `image` and `articleSection` (SEO Phase 6) are both optional and only
 * ever real, already-resolved values a caller passes in — the post's
 * actual featured-image URL (never a placeholder) and, when the post
 * has a real `relatedServiceSlug`, that service's own real name (e.g.
 * "Newborn Photography") — never invented here.
 */
export function blogPostingJsonLd(post: {
  title: string;
  excerpt: string;
  author: string;
  slug: string;
  publishedAt?: string;
  updatedAt: string;
  image?: string;
  articleSection?: string;
}) {
  const url = new URL(`/blog/${post.slug}/`, siteConfig.url).toString();
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || undefined,
    author: { "@type": "Organization", name: post.author || siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
    url,
    mainEntityOfPage: url,
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    dateModified: post.updatedAt,
    ...(post.image ? { image: new URL(post.image, siteConfig.url).toString() } : {}),
    ...(post.articleSection ? { articleSection: post.articleSection } : {}),
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
