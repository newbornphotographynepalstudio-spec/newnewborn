import type { AreaSlug } from "@/lib/data/areas";
import type { ServiceSlug } from "@/lib/data/service-pages";

export type BlogPostStatus = "draft" | "published";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImageId?: string;
  author: string;
  status: BlogPostStatus;
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  /**
   * The one real service/area this article is actually about (SEO Phase
   * 6) — optional, and only ever one of the site's real existing service
   * pages (lib/data/service-pages.ts ServiceSlug) or area pages
   * (lib/data/areas.ts AreaSlug). Drives a single, genuinely-relevant
   * contextual internal link on the article itself, rather than a
   * generic link list added purely for SEO. Never a free-text field —
   * that would risk linking to a page that doesn't exist.
   */
  relatedServiceSlug?: ServiceSlug;
  relatedAreaSlug?: AreaSlug;
  createdAt: string;
  updatedAt: string;
};

export const DEFAULT_AUTHOR = "Newborn Photography Nepal";
