import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/ui/Button";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { PageHero } from "@/components/ui/PageHero";
import { getPublishedPostBySlug } from "@/lib/blog/data";
import { areas } from "@/lib/data/areas";
import { getServicePages } from "@/lib/data/service-pages";
import { findGalleryImage } from "@/lib/media/all-images";
import { routes } from "@/lib/navigation/routes";
import { blogPostingJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/build-metadata";
import { formatDateLong } from "@/lib/utils/format-date";

type Params = { slug: string };

/** Matches `[label](/some-internal-path/)` — deliberately only a
 * site-relative path starting with `/`, never an external URL, so this
 * can't be used to link off-site from article body text. */
const INLINE_LINK = /\[([^\]]+)\]\((\/[a-zA-Z0-9\-/]*\/)\)/g;

/**
 * The blog `content` field is, and remains, plain text — no new
 * metadata/data-model system introduced here (SEO Phase 9). This only
 * teaches the existing paragraph renderer two small conventions so an
 * article can carry real structure and real contextual internal links
 * instead of every blank-line-separated block rendering as identical,
 * unlinked `<p>` text:
 *
 * 1. A block starting with `## `/`### ` renders as a real H2/H3.
 * 2. `[label](/path/)` anywhere in a paragraph renders as a real
 *    in-content link to that internal path (never an external URL).
 *
 * Fully backward-compatible: any existing or future post that never
 * uses either convention renders exactly as before.
 */
function renderInlineLinks(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  INLINE_LINK.lastIndex = 0;
  while ((match = INLINE_LINK.exec(text))) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    parts.push(
      <Link key={match.index} href={match[2]} className="text-plum underline-offset-4 hover:underline">
        {match[1]}
      </Link>
    );
    lastIndex = match.index + match[0].length;
  }
  parts.push(text.slice(lastIndex));
  return parts;
}

function ContentBlock({ text }: { text: string }) {
  if (text.startsWith("### ")) {
    return <h3 className="text-h4 text-plum">{renderInlineLinks(text.slice(4))}</h3>;
  }
  if (text.startsWith("## ")) {
    return <h2 className="text-h3">{renderInlineLinks(text.slice(3))}</h2>;
  }
  return <p className="text-body-lg leading-relaxed text-charcoal/85">{renderInlineLinks(text)}</p>;
}

/** Every gallery image `findGalleryImage` can return is a static import
 * (see lib/media/all-images.ts), so `.src` is always a real
 * `StaticImageData` object at runtime — but `ImageProps["src"]` is
 * typed as `string | StaticImport`, so this narrows it for the two
 * spots (OG image, JSON-LD image) that need a plain URL string. */
function resolveImageUrl(src: unknown): string | undefined {
  if (!src) return undefined;
  if (typeof src === "string") return src;
  if (typeof src === "object" && "src" in src && typeof src.src === "string") return src.src;
  return undefined;
}

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
  const image = findGalleryImage(post.featuredImageId);
  // buildPageMetadata (SEO Phase 6 fix) — this page previously built its
  // own bare {title, description, canonical} Metadata object, so unlike
  // every other page it had no openGraph/twitter at all (found live:
  // sharing a blog post on WhatsApp/social had no preview image or
  // description). buildPageMetadata fills those in the same way every
  // other page already gets them, falling back to the sitewide default
  // OG image when a post has no featured image of its own.
  return buildPageMetadata(`${routes.blog}${post.slug}/`, {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    ogImage: resolveImageUrl(image?.src),
  });
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
  // Real, already-published pages only — a post's relatedServiceSlug/
  // relatedAreaSlug (SEO Phase 6) can only ever be one of these actual
  // routes (see the admin PostForm's <select>), never a free-text value,
  // so this lookup can't produce a link to a page that doesn't exist.
  const relatedService = post.relatedServiceSlug ? getServicePages()[post.relatedServiceSlug] : undefined;
  const relatedArea = post.relatedAreaSlug ? areas[post.relatedAreaSlug] : undefined;
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Blog", href: routes.blog },
      { name: post.title, href: `${routes.blog}${post.slug}/` },
    ]),
    blogPostingJsonLd({ ...post, image: resolveImageUrl(image?.src), articleSection: relatedService?.name }),
  ];
  const paragraphs = post.content.split(/\n\s*\n/).filter(Boolean);

  return (
    <>
      {jsonLd.map((entry, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
        />
      ))}
      <PageHero eyebrow="Blog" title={post.title} description={post.excerpt} />

      {image ? (
        <Section compact>
          <EditorialImage src={image.src} alt={image.alt} aspect="wide" rounded />
        </Section>
      ) : null}

      <Section containerSize="prose">
        <div className="space-y-5">
          {paragraphs.map((paragraph, index) => (
            <ContentBlock key={index} text={paragraph} />
          ))}
        </div>
        {post.publishedAt ? (
          <p className="mt-8 border-t border-taupe/20 pt-4 text-caption text-taupe">
            By {post.author} ·{" "}
            {formatDateLong(post.publishedAt)}
          </p>
        ) : null}

        {relatedService || relatedArea ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {relatedService ? (
              <Button href={relatedService.href} variant="secondary" size="sm">
                {relatedService.name} Sessions
              </Button>
            ) : null}
            {relatedArea ? (
              <Button href={relatedArea.href} variant="secondary" size="sm">
                {relatedArea.name} Photography
              </Button>
            ) : null}
          </div>
        ) : null}
      </Section>
    </>
  );
}
