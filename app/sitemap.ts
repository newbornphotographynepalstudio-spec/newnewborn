import type { MetadataRoute } from "next";

import { getPublishedPosts } from "@/lib/blog/data";
import { routes } from "@/lib/navigation/routes";
import { siteConfig } from "@/lib/seo/site";

/**
 * `force-dynamic` (found live, SEO Phase 9): this route uses no dynamic
 * request APIs (no cookies/headers), so without this Next.js treats it
 * as fully static — generated once at build time and then served as a
 * plain static file forever, with no further mechanism to update it.
 * `revalidatePath("/sitemap.xml")` (lib/blog/actions.ts) only works on
 * routes Next already considers revalidatable, so it had no effect here
 * on its own. The practical result, confirmed live: a post published
 * (or deleted) through admin went live on the site immediately, but
 * never appeared in (or disappeared from) the actual sitemap.xml search
 * engines fetch until the next full production build/deploy. This route
 * is low-traffic (crawlers, not visitors), so rendering it fresh on
 * every request is the simple, unambiguous fix — no caching subtlety to
 * get wrong later.
 *
 * Static routes plus every published blog post slug (Phase 13) —
 * `portfolioGalleries` stays static-route-only, since uploaded Media
 * Library photos are shown *within* the existing /portfolio/{category}/
 * pages (already in `routes`), not as their own separate URLs. /admin is
 * intentionally excluded (see robots.ts). Draft posts are never
 * included — only what getPublishedPosts() itself would show publicly.
 */
export const dynamic = "force-dynamic";
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
