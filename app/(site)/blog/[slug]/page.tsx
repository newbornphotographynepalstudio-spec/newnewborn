import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Section } from "@/components/primitives/Section";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { PageHero } from "@/components/ui/PageHero";
import { getPublishedPostBySlug } from "@/lib/blog/data";
import { findGalleryImage } from "@/lib/media/all-images";
import { routes } from "@/lib/navigation/routes";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) {
    return { title: "Article not found", robots: { index: false, follow: false } };
  }
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || undefined,
    alternates: { canonical: `${routes.blog}${post.slug}/` },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const image = findGalleryImage(post.featuredImageId);
  const jsonLd = breadcrumbJsonLd([
    { name: "Blog", href: routes.blog },
    { name: post.title, href: `${routes.blog}${post.slug}/` },
  ]);
  const paragraphs = post.content.split(/\n\s*\n/).filter(Boolean);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero eyebrow="Blog" title={post.title} description={post.excerpt} />

      {image ? (
        <Section compact>
          <EditorialImage src={image.src} alt={image.alt} aspect="wide" rounded />
        </Section>
      ) : null}

      <Section containerSize="prose">
        <div className="space-y-5">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-body-lg leading-relaxed text-charcoal/85">
              {paragraph}
            </p>
          ))}
        </div>
        {post.publishedAt ? (
          <p className="mt-8 border-t border-taupe/20 pt-4 text-caption text-taupe">
            By {post.author} ·{" "}
            {new Date(post.publishedAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        ) : null}
      </Section>
    </>
  );
}
