import type { MetadataRoute } from "next";

import { getPublishedPosts } from "@/lib/blog/data";
import { routes } from "@/lib/navigation/routes";
import { siteConfig } from "@/lib/seo/site";

/**
 * Static routes plus every published blog post slug (Phase 13) —
 * `portfolioGalleries` stays static-route-only, since uploaded Media
 * Library photos are shown *within* the existing /portfolio/{category}/
 * pages (already in `routes`), not as their own separate URLs. /admin is
 * intentionally excluded (see robots.ts). Draft posts are never
 * included — only what getPublishedPosts() itself would show publicly.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const staticEntries = Object.values(routes).map((path) => ({
    url: new URL(path, siteConfig.url).toString(),
    lastModified,
  }));

  const posts = await getPublishedPosts();
  const postEntries = posts.map((post) => ({
    url: new URL(`${routes.blog}${post.slug}/`, siteConfig.url).toString(),
    lastModified: new Date(post.updatedAt),
  }));

  return [...staticEntries, ...postEntries];
}
