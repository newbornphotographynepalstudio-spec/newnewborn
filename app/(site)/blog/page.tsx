import Link from "next/link";
import type { Metadata } from "next";

import { Section } from "@/components/primitives/Section";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { PageHero } from "@/components/ui/PageHero";
import { getPublishedPosts } from "@/lib/blog/data";
import { resolveFeaturedImage } from "@/lib/blog/resolve-image";
import { routes } from "@/lib/navigation/routes";
import { buildPageMetadata } from "@/lib/seo/build-metadata";
import { formatDateLong } from "@/lib/utils/format-date";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata(routes.blog, {
    title: "Blog",
    description: "Articles on newborn safety, session preparation and photography from Newborn Photography Nepal.",
  });
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  // Resolved up front (not inside the render map, which can't await) so
  // a post's featured image can come from either the static galleries or
  // a real, published Media Library photo — the same resolution the
  // article's own page already used (SEO Phase 16; previously this page
  // only checked the static galleries, so a Media-Library-sourced image
  // like the maternity article's real photo rendered on its own page but
  // never showed a thumbnail here).
  const postsWithImages = await Promise.all(
    posts.map(async (post) => ({ post, image: await resolveFeaturedImage(post.featuredImageId) }))
  );

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title={posts.length > 0 ? "Notes from the studio" : "Articles are on their way"}
        description={
          posts.length > 0
            ? "Session-prep guides and photography notes from Newborn Photography Nepal."
            : "This is where session-prep guides and photography notes will be published. Nothing is live yet."
        }
      />

      <Section>
        {posts.length === 0 ? (
          <div className="mx-auto max-w-md border border-dashed border-taupe/40 bg-white px-8 py-10 text-center">
            <p className="text-small leading-relaxed text-charcoal/75">
              No articles have been published yet. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {postsWithImages.map(({ post, image }) => {
              return (
                <Link key={post.id} href={`${routes.blog}${post.slug}/`} className="group block">
                  {image ? (
                    <EditorialImage src={image.src} alt={image.alt} aspect="landscape" rounded />
                  ) : null}
                  <h2 className="mt-4 text-h4 text-plum group-hover:underline">{post.title}</h2>
                  {post.excerpt ? (
                    <p className="mt-2 text-small leading-relaxed text-charcoal/75">{post.excerpt}</p>
                  ) : null}
                  {post.publishedAt ? (
                    <p className="mt-2 text-caption text-taupe">
                      {formatDateLong(post.publishedAt)}
                    </p>
                  ) : null}
                </Link>
              );
            })}
          </div>
        )}
      </Section>
    </>
  );
}
