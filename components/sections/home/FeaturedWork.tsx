import { EditorialGrid } from "@/components/primitives/EditorialGrid";
import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/ui/Button";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Reveal } from "@/components/ui/Reveal";
import { getFeaturedMedia } from "@/lib/media/library-data";
import { newbornGallery } from "@/lib/media/newborn-gallery";
import { routes } from "@/lib/navigation/routes";

const fallbackOne = newbornGallery.find((img) => img.id === "newborn-wrapped-bucket")!;
const fallbackTwo = newbornGallery.find((img) => img.id === "newborn-snail-basket")!;

/**
 * A two-image editorial pairing. When an admin has marked 2+ Media
 * Library photos as Featured, the first two (by order) replace the
 * default pair here — content is admin-controlled, but the asymmetric
 * 7/5-column layout and aspect treatment stay exactly as designed,
 * regardless of which photos are shown. Falls back to the original
 * hand-picked newborn session pair whenever fewer than 2 are marked
 * featured, so this section never looks broken or half-configured.
 */
export async function FeaturedWork() {
  const featured = await getFeaturedMedia();
  const useFeatured = featured.length >= 2;

  const one = useFeatured
    ? { src: featured[0].url, alt: featured[0].alt }
    : { src: fallbackOne.src, alt: fallbackOne.alt, desktopAspect: fallbackOne.desktopAspect, mobileAspect: fallbackOne.mobileAspect, objectPosition: fallbackOne.objectPosition };
  const two = useFeatured ? { src: featured[1].url, alt: featured[1].alt } : { src: fallbackTwo.src, alt: fallbackTwo.alt };

  return (
    <Section tone="blush">
      <EditorialGrid className="items-end">
        <div className="col-span-12 lg:col-span-7">
          <Reveal>
            <EditorialImage
              src={one.src}
              alt={one.alt}
              aspect={"desktopAspect" in one ? one.desktopAspect : "landscape"}
              mobileAspect={"mobileAspect" in one ? one.mobileAspect : undefined}
              position={"objectPosition" in one ? one.objectPosition : "center"}
              sizes="(min-width: 1024px) 58vw, 100vw"
              rounded
            />
          </Reveal>
        </div>
        <div className="col-span-12 lg:col-span-5">
          <Reveal delay={75}>
            <EditorialImage
              src={two.src}
              alt={two.alt}
              aspect="square"
              sizes="(min-width: 1024px) 33vw, 100vw"
              rounded
            />
          </Reveal>
        </div>
      </EditorialGrid>

      <div className="mx-auto mt-10 max-w-2xl text-center">
        <p className="text-eyebrow font-medium tracking-eyebrow text-taupe uppercase">
          Featured Work
        </p>
        <h2 className="mt-3 text-h2">From recent newborn sessions</h2>
        <p className="mx-auto mt-4 max-w-prose text-body-lg leading-relaxed text-charcoal/80">
          Every session is photographed with the same care: quiet styling,
          natural expressions, and enough time for your baby to settle.
        </p>
        <Button href={routes.portfolioNewborn} variant="text" className="mt-6">
          View Newborn Portfolio
        </Button>
      </div>
    </Section>
  );
}
