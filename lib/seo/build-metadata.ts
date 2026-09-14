import "server-only";

import type { Metadata } from "next";

import { getPageSeoOverride } from "@/lib/seo/page-overrides";
import { siteConfig } from "@/lib/seo/site";
import { getSiteSettings } from "@/lib/settings/data";

/**
 * Merges a page's own hardcoded default metadata with an admin-entered
 * Firestore override (if any), for static pages that don't otherwise
 * have per-item CMS-backed SEO fields (unlike posts/packages, which
 * carry their own seoTitle/seoDescription directly). Every override
 * field falls back to the page's existing default, so a page with no
 * override at all — the state every page is in until an admin actually
 * edits one via /admin/seo/ — produces byte-identical metadata to
 * before this existed.
 *
 * Also fills in `openGraph.type`/`locale`/`siteName`/`url` and
 * `twitter.card`, and falls back to the site's default share image when
 * a page has none of its own — found live in Phase 15.1: Next.js
 * replaces (never deep-merges) a page's `openGraph`/`twitter` object
 * against the root layout's, so every page calling this function was
 * silently missing og:type/og:site_name/og:locale/og:url entirely, and
 * every page except the homepage had no og:image/twitter:image at all
 * (checked against real rendered HTML on /packages/, not assumed).
 */
export async function buildPageMetadata(
  path: string,
  defaults: { title: string; description: string; ogImage?: string }
): Promise<Metadata> {
  const [override, { seo }] = await Promise.all([getPageSeoOverride(path), getSiteSettings()]);

  const title = override?.seoTitle || defaults.title;
  const description = override?.metaDescription || defaults.description;
  const ogTitle = override?.ogTitle || title;
  const ogDescription = override?.ogDescription || description;
  // Same fallback image app/layout.tsx uses for the site-wide default,
  // so a page with no photo of its own still gets a real share image
  // instead of none.
  const siteDefaultOgImage = seo.defaultOgImage || "/photography/culture1.jpg";
  const ogImage = override?.ogImage || defaults.ogImage || siteDefaultOgImage;
  const twitterTitle = override?.twitterTitle || title;
  const twitterDescription = override?.twitterDescription || description;
  const twitterImage = override?.twitterImage || ogImage;
  const canonicalPath = override?.canonicalUrl || path;

  const metadata: Metadata = {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      siteName: seo.siteName || siteConfig.name,
      url: new URL(canonicalPath, siteConfig.url).toString(),
      title: ogTitle,
      description: ogDescription,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: twitterTitle,
      description: twitterDescription,
      ...(twitterImage ? { images: [twitterImage] } : {}),
    },
  };

  if (override?.noindex || override?.nofollow) {
    metadata.robots = { index: !override.noindex, follow: !override.nofollow };
  }

  return metadata;
}
