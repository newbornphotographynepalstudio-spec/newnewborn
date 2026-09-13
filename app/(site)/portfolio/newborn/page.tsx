import type { Metadata } from "next";

import { Cluster } from "@/components/primitives/Cluster";
import { EditorialGrid } from "@/components/primitives/EditorialGrid";
import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/ui/Button";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { newbornGallery } from "@/lib/media/newborn-gallery";
import { bookASessionCta, routes } from "@/lib/navigation/routes";

const [featured, ...rest] = newbornGallery.filter((img) => img.id !== "newborn-family-heritage");
const familyPortrait = newbornGallery.find((img) => img.id === "newborn-family-heritage")!;
const [rowOne1, rowOne2, rowTwo1, rowTwo2] = rest;

export const metadata: Metadata = {
  title: "Newborn Portfolio",
  description:
    "A newborn photography portfolio from Newborn Photography Nepal — real sessions photographed in a Kathmandu studio, styled with quiet care.",
  alternates: { canonical: routes.portfolioNewborn },
};

export default function NewbornPortfolioPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Newborn Photography Portfolio"
        description="A look at real newborn sessions — no stock photography, every image from an actual session in the studio."
      >
        <Cluster gap="sm" className="mt-8">
          <Button href={`${bookASessionCta.href}?type=newborn`}>{bookASessionCta.label}</Button>
          <Button href={routes.newborn} variant="secondary">
            Newborn Photography
          </Button>
        </Cluster>
      </PageHero>

      <Section>
        <Reveal>
          <EditorialImage
            src={featured.src}
            alt={featured.alt}
            aspect={featured.desktopAspect}
            mobileAspect={featured.mobileAspect}
            position={featured.objectPosition}
            priority
            sizes="100vw"
            rounded
          />
        </Reveal>
      </Section>

      <Section tone="ivory">
        <SectionHeading eyebrow="Editorial Gallery" title="Recent newborn sessions" />
        <EditorialGrid className="mt-12">
          <div className="col-span-12 lg:col-span-8">
            <Reveal>
              <EditorialImage
                src={rowOne1.src}
                alt={rowOne1.alt}
                aspect={rowOne1.desktopAspect}
                mobileAspect={rowOne1.mobileAspect}
                position={rowOne1.objectPosition}
                sizes="(min-width: 1024px) 66vw, 100vw"
                rounded
              />
            </Reveal>
          </div>
          <div className="col-span-12 lg:col-span-4">
            <Reveal delay={75}>
              <EditorialImage
                src={rowOne2.src}
                alt={rowOne2.alt}
                aspect={rowOne2.desktopAspect}
                mobileAspect={rowOne2.mobileAspect}
                position={rowOne2.objectPosition}
                sizes="(min-width: 1024px) 33vw, 100vw"
                rounded
              />
            </Reveal>
          </div>
          <div className="col-span-12 lg:col-span-5">
            <Reveal>
              <EditorialImage
                src={rowTwo1.src}
                alt={rowTwo1.alt}
                aspect={rowTwo1.desktopAspect}
                mobileAspect={rowTwo1.mobileAspect}
                position={rowTwo1.objectPosition}
                sizes="(min-width: 1024px) 41vw, 100vw"
                rounded
              />
            </Reveal>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <Reveal delay={75}>
              <EditorialImage
                src={rowTwo2.src}
                alt={rowTwo2.alt}
                aspect={rowTwo2.desktopAspect}
                mobileAspect={rowTwo2.mobileAspect}
                position={rowTwo2.objectPosition}
                sizes="(min-width: 1024px) 58vw, 100vw"
                rounded
              />
            </Reveal>
          </div>
        </EditorialGrid>
      </Section>

      <Section tone="blush">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <Reveal>
              <EditorialImage
                src={familyPortrait.src}
                alt={familyPortrait.alt}
                aspect={familyPortrait.desktopAspect}
                mobileAspect={familyPortrait.mobileAspect}
                position={familyPortrait.objectPosition}
                sizes="(min-width: 1024px) 50vw, 100vw"
                rounded
              />
            </Reveal>
          </div>
          <div className="flex flex-col justify-center lg:col-span-6">
            <Reveal delay={75}>
              <p className="text-eyebrow font-medium tracking-eyebrow text-taupe uppercase">
                More Than One Portrait
              </p>
              <h2 className="mt-3 text-h2">A newborn session is a family session too</h2>
              <p className="mt-5 max-w-prose text-body-lg leading-relaxed text-charcoal/80">
                Many families bring grandparents, in traditional dress or
                otherwise, into part of the session — a few portraits
                alongside the newborn images, not a separate booking. It
                often becomes one of the images a family keeps longest.
              </p>
            </Reveal>
          </div>
        </div>
      </Section>

      <Section compact>
        <div className="flex flex-col items-start justify-between gap-4 border-t border-b border-taupe/20 py-8 lg:flex-row lg:items-center">
          <div>
            <p className="text-eyebrow font-medium tracking-eyebrow text-taupe uppercase">Safety</p>
            <p className="mt-2 max-w-lg text-body text-charcoal/80">
              Every pose above was baby-led, gently supported, and never
              forced — see the full approach to newborn safety.
            </p>
          </div>
          <Button href={routes.safety} variant="secondary" size="sm" className="shrink-0">
            Learn About Safety
          </Button>
        </div>
      </Section>

      <Section tone="ivory" compact>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-eyebrow font-medium tracking-eyebrow text-taupe uppercase">Studio</p>
          <h2 className="mt-3 text-h3">Photographed in a calm Kathmandu studio</h2>
          <p className="mt-3 text-body leading-relaxed text-charcoal/80">
            Every session above was photographed in the studio — a
            private, newborn-friendly space kept warm and quiet.
          </p>
          <Button href={routes.studio} variant="text" className="mt-4">
            About the Studio
          </Button>
        </div>
      </Section>

      <Section tone="plum">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-h2 text-white">Ready for your own session?</h2>
          <p className="mt-4 text-body-lg leading-relaxed text-white/80">
            Newborn sessions are best booked during pregnancy, so a date is
            held for the first couple of weeks after birth.
          </p>
          <Cluster gap="sm" align="center" justify="center" className="mt-8">
            <Button href={`${bookASessionCta.href}?type=newborn`} className="!bg-white !text-plum hover:!bg-blush">
              {bookASessionCta.label}
            </Button>
            <Button
              href={routes.newborn}
              variant="secondary"
              className="!border-white/50 !text-white hover:!border-white hover:!bg-white/10"
            >
              Newborn Photography
            </Button>
          </Cluster>
        </div>
      </Section>
    </>
  );
}
