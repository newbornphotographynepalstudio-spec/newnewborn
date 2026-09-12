import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

/**
 * No blog posts exist yet — there is no Firestore `blogPosts` data to read.
 * This route exists so /blog/[slug] is real and buildable; Phase 2 replaces
 * the body with a Firestore lookup by slug (404 via notFound() when the
 * slug doesn't resolve to a published post).
 */

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: slugToTitle(slug),
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  return (
    <PagePlaceholder
      eyebrow="Blog"
      title={slugToTitle(slug)}
      description="This article has not been published yet."
    />
  );
}

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
