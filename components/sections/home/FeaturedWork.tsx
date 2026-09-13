import { EditorialGrid } from "@/components/primitives/EditorialGrid";
import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/ui/Button";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cultureHeritageImage } from "@/lib/media/approved-assets";
import { routes } from "@/lib/navigation/routes";

/**
 * A portfolio preview to show real photographic quality before asking
 * for a booking. Only one approved newborn photograph exists right now
 * (this is its second and last appearance on the homepage, after the
 * hero) — the two placeholder tiles are honest "coming soon" slots, not
 * invented photography, ready to be replaced once a real gallery exists.
 */
export function FeaturedWork() {
  return (
    <Section tone="blush">
      <SectionHeading
        eyebrow="Featured Work"
        title="From recent newborn sessions"
        description="A glimpse of the studio's newborn photography — the full portfolio is being added."
      />

      <EditorialGrid className="mt-2xl">
        <div className="col-span-12 lg:col-span-7">
          <Reveal>
            <EditorialImage
              src={cultureHeritageImage.src}
              alt={cultureHeritageImage.alt}
              aspect="landscape"
              sizes="(min-width: 1024px) 58vw, 100vw"
            />
          </Reveal>
        </div>
        <div className="col-span-12 grid grid-cols-2 gap-md lg:col-span-5 lg:grid-rows-2">
          <PlaceholderTile />
          <PlaceholderTile />
        </div>
      </EditorialGrid>

      <div className="mt-xl">
        <Button href={routes.portfolioNewborn} variant="text">
          View Newborn Portfolio
        </Button>
      </div>
    </Section>
  );
}

function PlaceholderTile() {
  return (
    <div
      aria-hidden
      className="flex aspect-square items-center justify-center bg-white/60 lg:aspect-auto"
    >
      <span className="px-sm text-center text-caption tracking-eyebrow text-taupe uppercase">
        More coming soon
      </span>
    </div>
  );
}
