import type { Metadata } from "next";

import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/ui/Button";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { PageHero } from "@/components/ui/PageHero";
import { portfolioCategories } from "@/lib/data/portfolio";
import { cakeSmashGallery } from "@/lib/media/cake-smash-gallery";
import { getPublishedMediaByCategory } from "@/lib/media/library-data";
import type { MediaLibraryCategory } from "@/lib/media/library-types";
import { newbornGallery } from "@/lib/media/newborn-gallery";
import { routes } from "@/lib/navigation/routes";
import { buildPageMetadata } from "@/lib/seo/build-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata(routes.portfolio, {
    title: "Portfolio",
    description: "Newborn, maternity, baby, cake smash and family photography from Newborn Photography Nepal.",
  });
}

/** One representative real photo per category, so the index page shows
 * actual work instead of a bare text list — found in Phase 16.6's
 * content audit as a real conversion gap (zero images on this specific
 * page, even though the category pages underneath it have real photos).
 * Prefers the existing approved static galleries (Newborn, Cake Smash —
 * the only two with any photos yet); Maternity/Baby/Family have none
 * yet, so this checks the Supabase-backed Media Library too, and shows
 * no thumbnail at all for a category with neither — never a placeholder
 * graphic standing in for a real photo that doesn't exist. */
async function getPreviewPhoto(
  category: MediaLibraryCategory
): Promise<{ src: string | (typeof newbornGallery)[number]["src"]; alt: string } | null> {
  if (category === "newborn") {
    const photo = newbornGallery.find((img) => img.id === "newborn-wrapped-bucket")!;
    return { src: photo.src, alt: photo.alt };
  }
  if (category === "cake-smash") {
    const photo = cakeSmashGallery.find((img) => img.id === "cakesmash-boho-sunflower")!;
    return { src: photo.src, alt: photo.alt };
  }
  const uploaded = await getPublishedMediaByCategory(category);
  const first = uploaded[0];
  return first ? { src: first.url, alt: first.alt } : null;
}

export default async function PortfolioPage() {
  const previews = await Promise.all(
    portfolioCategories.map((category) => getPreviewPhoto(category.slug))
  );

  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="A look at the work"
        description="Galleries are organized by session type. The full portfolio is being built out as sessions are completed."
      />

      <Section>
        <div className="border-t border-taupe/20">
          {portfolioCategories.map((category, index) => {
            const preview = previews[index];
            return (
              <a
                key={category.slug}
                href={category.href}
                className="group flex items-center justify-between gap-6 border-b border-taupe/20 py-6 lg:py-8"
              >
                <span className="flex items-center gap-5">
                  {preview ? (
                    <EditorialImage
                      src={preview.src}
                      alt={preview.alt}
                      aspect="square"
                      sizes="80px"
                      rounded
                      className="w-16 shrink-0 sm:w-20"
                    />
                  ) : null}
                  <span className="flex items-baseline gap-4">
                    <span className="text-caption text-taupe">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-h3 text-plum transition-colors duration-base group-hover:text-charcoal">
                      {category.name}
                    </span>
                  </span>
                </span>
                <span aria-hidden className="text-plum transition-transform duration-base group-hover:translate-x-1">
                  →
                </span>
              </a>
            );
          })}
        </div>
      </Section>

      <Section tone="blush" compact>
        <div className="mx-auto max-w-xl text-center">
          <p className="text-body leading-relaxed text-charcoal/80">
            Ready to be part of the next gallery?
          </p>
          <Button href={routes.bookASession} className="mt-4">
            Book a Session
          </Button>
        </div>
      </Section>
    </>
  );
}
