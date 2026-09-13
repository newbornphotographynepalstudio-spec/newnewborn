import { EditorialGrid } from "@/components/primitives/EditorialGrid";
import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/ui/Button";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Reveal } from "@/components/ui/Reveal";
import { newbornGallery } from "@/lib/media/newborn-gallery";
import { routes } from "@/lib/navigation/routes";

const featuredOne = newbornGallery.find((img) => img.id === "newborn-wrapped-bucket")!;
const featuredTwo = newbornGallery.find((img) => img.id === "newborn-snail-basket")!;

/** A two-image editorial pairing from real newborn sessions, not a single
 * repeated image — the full set lives at /portfolio/newborn/. */
export function FeaturedWork() {
  return (
    <Section tone="blush">
      <EditorialGrid className="items-end">
        <div className="col-span-12 lg:col-span-7">
          <Reveal>
            <EditorialImage
              src={featuredOne.src}
              alt={featuredOne.alt}
              aspect={featuredOne.desktopAspect}
              mobileAspect={featuredOne.mobileAspect}
              position={featuredOne.objectPosition}
              sizes="(min-width: 1024px) 58vw, 100vw"
              rounded
            />
          </Reveal>
        </div>
        <div className="col-span-12 lg:col-span-5">
          <Reveal delay={75}>
            <EditorialImage
              src={featuredTwo.src}
              alt={featuredTwo.alt}
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
          Every session is photographed with the same care — quiet styling,
          natural expressions, and enough time for your baby to settle.
        </p>
        <Button href={routes.portfolioNewborn} variant="text" className="mt-6">
          View Newborn Portfolio
        </Button>
      </div>
    </Section>
  );
}
