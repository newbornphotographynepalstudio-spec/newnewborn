import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/ui/Button";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Reveal } from "@/components/ui/Reveal";
import { cultureHeritageImage } from "@/lib/media/approved-assets";
import { routes } from "@/lib/navigation/routes";

/**
 * Only one approved newborn photograph exists right now (its second and
 * last appearance on the homepage, after the hero) — shown large and on
 * its own rather than padded out with placeholder tiles, which read as
 * emptier than a single confident image.
 */
export function FeaturedWork() {
  return (
    <Section tone="blush">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <Reveal>
            <EditorialImage
              src={cultureHeritageImage.src}
              alt={cultureHeritageImage.alt}
              aspect="landscape"
              sizes="(min-width: 1024px) 58vw, 100vw"
              rounded
            />
          </Reveal>
        </div>
        <div className="lg:col-span-5">
          <Reveal delay={75}>
            <p className="text-eyebrow font-medium tracking-eyebrow text-taupe uppercase">
              Featured Work
            </p>
            <h2 className="mt-3 text-h2">From a recent newborn session</h2>
            <p className="mt-4 text-body-lg leading-relaxed text-charcoal/80">
              Every session is photographed with the same care — quiet
              styling, natural expressions, and enough time for your baby to
              settle. The full newborn portfolio is being added as sessions
              are completed.
            </p>
            <Button href={routes.portfolioNewborn} variant="text" className="mt-6">
              View Newborn Portfolio
            </Button>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
