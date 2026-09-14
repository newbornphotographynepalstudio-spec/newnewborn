import "server-only";

import { PAGE_REGISTRY } from "@/lib/seo/page-registry";
import { getPageSeoOverride, pathToDocId } from "@/lib/seo/page-overrides";
import { getPublishedPosts } from "@/lib/blog/data";
import { routes } from "@/lib/navigation/routes";

export type EffectiveSeoRow = {
  path: string;
  label: string;
  docId: string;
  hasOverride: boolean;
  title: string;
  titleSource: "Admin override" | "Code default";
  description: string;
  descriptionSource: "Admin override" | "Code default";
  canonical: string;
  canonicalSource: "Admin override" | "Code default";
  robots: string;
  robotsSource: "Admin override" | "Code default";
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  schema: string;
};

function metaString(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "default" in (value as Record<string, unknown>)) {
    return String((value as { default: unknown }).default ?? "");
  }
  return "";
}

function firstImage(images: unknown): string {
  if (!images) return "";
  const arr = Array.isArray(images) ? images : [images];
  const first = arr[0];
  if (!first) return "";
  if (typeof first === "string") return first;
  if (typeof first === "object" && "url" in (first as Record<string, unknown>)) {
    return String((first as { url: unknown }).url ?? "");
  }
  return "";
}

/** Effective SEO for every statically-registered public page — the real
 * title/description/canonical/robots/OG/Twitter Next.js will actually
 * render, computed by calling each page's own `generateMetadata`, plus
 * whether each field came from a Firestore `pageSeo` override or the
 * page's own hardcoded default (compared field-by-field against the raw
 * override document, mirroring exactly how buildPageMetadata falls
 * back). */
export async function getEffectiveSeoRows(): Promise<EffectiveSeoRow[]> {
  return Promise.all(
    PAGE_REGISTRY.map(async ({ path, label, getMetadata, schema }) => {
      const [metadata, override] = await Promise.all([getMetadata(), getPageSeoOverride(path)]);

      const og = metadata.openGraph as { title?: unknown; description?: unknown; images?: unknown } | undefined;
      const twitter = metadata.twitter as { title?: unknown; description?: unknown; images?: unknown } | undefined;
      const robots = metadata.robots;
      const robotsStr =
        typeof robots === "object" && robots
          ? `index: ${"index" in robots ? robots.index : true}, follow: ${"follow" in robots ? robots.follow : true}`
          : "index, follow (default)";

      return {
        path,
        label,
        docId: pathToDocId(path),
        hasOverride: Boolean(override),
        title: metaString(metadata.title),
        titleSource: override?.seoTitle ? "Admin override" : "Code default",
        description: metadata.description ?? "",
        descriptionSource: override?.metaDescription ? "Admin override" : "Code default",
        canonical:
          typeof metadata.alternates?.canonical === "string"
            ? metadata.alternates.canonical
            : String(metadata.alternates?.canonical ?? ""),
        canonicalSource: override?.canonicalUrl ? "Admin override" : "Code default",
        robots: robotsStr,
        robotsSource: override?.noindex || override?.nofollow ? "Admin override" : "Code default",
        ogTitle: metaString(og?.title),
        ogDescription: metaString(og?.description),
        ogImage: firstImage(og?.images),
        twitterTitle: metaString(twitter?.title),
        twitterDescription: metaString(twitter?.description),
        twitterImage: firstImage(twitter?.images),
        schema,
      } satisfies EffectiveSeoRow;
    })
  );
}

export type EffectiveBlogRow = {
  path: string;
  label: string;
  title: string;
  description: string;
  canonical: string;
  source: "Post's own SEO fields" | "Post title/excerpt (no SEO override on the post)";
};

/** Blog posts carry their own per-item seoTitle/seoDescription directly
 * on the `posts` document (see lib/blog/actions.ts) rather than going
 * through the generic `pageSeo` override collection — this reflects that
 * real mechanism, one row per real published post, not invented data. */
export async function getEffectiveBlogRows(): Promise<EffectiveBlogRow[]> {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({
    path: `${routes.blog}${post.slug}/`,
    label: post.title,
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || "",
    canonical: `${routes.blog}${post.slug}/`,
    source: post.seoTitle || post.seoDescription ? "Post's own SEO fields" : "Post title/excerpt (no SEO override on the post)",
  }));
}
