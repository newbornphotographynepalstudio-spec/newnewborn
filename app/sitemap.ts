import type { MetadataRoute } from "next";

import { routes } from "@/lib/navigation/routes";
import { siteConfig } from "@/lib/seo/site";

/**
 * Static routes only. Once `blogPosts` and `portfolioGalleries` exist in
 * Firestore, extend this with their published slugs (Phase 2+); /admin is
 * intentionally excluded (see robots.ts).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return Object.values(routes).map((path) => ({
    url: new URL(path, siteConfig.url).toString(),
    lastModified,
  }));
}
