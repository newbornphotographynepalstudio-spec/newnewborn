import "server-only";

import type { Metadata } from "next";

import { getPageSeoOverride } from "@/lib/seo/page-overrides";

/**
 * Merges a page's own hardcoded default metadata with an admin-entered
 * Firestore override (if any), for static pages that don't otherwise
 * have per-item CMS-backed SEO fields (unlike posts/packages, which
 * carry their own seoTitle/seoDescription directly). Every override
 * field falls back to the page's existing default, so a page with no
 * override at all — the state every page is in until an admin actually
 * edits one via /admin/seo/ — produces byte-identical metadata to
 * before this existed.
 */
export async function buildPageMetadata(
  path: string,
  defaults: { title: string; description: string; ogImage?: string }
): Promise<Metadata> {
  const override = await getPageSeoOverride(path);

  const title = override?.seoTitle || defaults.title;
  const description = override?.metaDescription || defaults.description;
  const ogTitle = override?.ogTitle || title;
  const ogDescription = override?.ogDescription || description;
  const ogImage = override?.ogImage || defaults.ogImage;
  const twitterTitle = override?.twitterTitle || title;
  const twitterDescription = override?.twitterDescription || description;
  const twitterImage = override?.twitterImage || ogImage;

  const metadata: Metadata = {
    title,
    description,
    alternates: { canonical: override?.canonicalUrl || path },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    twitter: {
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
