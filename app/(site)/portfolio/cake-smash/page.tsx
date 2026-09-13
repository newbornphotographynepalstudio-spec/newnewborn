import type { Metadata } from "next";

import { Cluster } from "@/components/primitives/Cluster";
import { EditorialGrid } from "@/components/primitives/EditorialGrid";
import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/ui/Button";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cakeSmashGallery } from "@/lib/media/cake-smash-gallery";
import { bookASessionCta, routes } from "@/lib/navigation/routes";

const [featured, ...rest] = cakeSmashGallery;
const [rowOne1, rowOne2, rowTwo1, rowTwo2] = rest;

export const metadata: Metadata = {
  title: "Cake Smash Portfolio",
  description:
    "A cake smash photography portfolio from Newborn Photography Nepal — real first-birthday sessions photographed in a Kathmandu studio.",
  alternates: { canonical: routes.portfolioCakeSmash },
};

export default function CakeSmashPortfolioPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Cake Smash Photography Portfolio"
        description="First-birthday sessions as they actually happened — icing, mess and all."
      >
        <Cluster gap="sm" className="mt-8">
          <Button href={bookASessionCta.href}>{bookASessionCta.label}</Button>
          <Button href={routes.cakeSmash} variant="secondary">
            Cake Smash Photography
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

      <Section tone="blush">
        <SectionHeading eyebrow="Editorial Gallery" title="From setup to celebration" />
        <EditorialGrid className="mt-12">
          <div className="col-span-12 lg:col-span-7">
            <Reveal>
              <EditorialImage
                src={rowOne1.src}
                alt={rowOne1.alt}
                aspect={rowOne1.desktopAspect}
                mobileAspect={rowOne1.mobileAspect}
                position={rowOne1.objectPosition}
                sizes="(min-width: 1024px) 58vw, 100vw"
                rounded
              />
            </Reveal>
          </div>
          <div className="col-span-12 lg:col-span-5">
            <Reveal delay={75}>
              <EditorialImage
                src={rowOne2.src}
                alt={rowOne2.alt}
                aspect={rowOne2.desktopAspect}
                mobileAspect={rowOne2.mobileAspect}
                position={rowOne2.objectPosition}
                sizes="(min-width: 1024px) 41vw, 100vw"
                rounded
              />
            </Reveal>
          </div>
          <div className="col-span-12 lg:col-span-4">
            <Reveal>
              <EditorialImage
                src={rowTwo1.src}
                alt={rowTwo1.alt}
                aspect={rowTwo1.desktopAspect}
                mobileAspect={rowTwo1.mobileAspect}
                position={rowTwo1.objectPosition}
                sizes="(min-width: 1024px) 33vw, 100vw"
                rounded
              />
            </Reveal>
          </div>
          <div className="col-span-12 lg:col-span-8">
            <Reveal delay={75}>
              <EditorialImage
                src={rowTwo2.src}
                alt={rowTwo2.alt}
                aspect={rowTwo2.desktopAspect}
                mobileAspect={rowTwo2.mobileAspect}
                position={rowTwo2.objectPosition}
                sizes="(min-width: 1024px) 66vw, 100vw"
                rounded
              />
            </Reveal>
          </div>
        </EditorialGrid>
      </Section>

      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-eyebrow font-medium tracking-eyebrow text-taupe uppercase">
            The Approach
          </p>
          <h2 className="mt-3 text-h2">Playful, not chaotic</h2>
          <p className="mx-auto mt-5 max-w-prose text-body-lg leading-relaxed text-charcoal/80">
            A cake smash set is planned — backdrop, cake and props chosen
            beforehand — but what happens once the cake arrives is
            entirely up to your child. The photography keeps up with
            that, rather than trying to direct it.
          </p>
        </div>
      </Section>

      <Section tone="ivory" compact>
        <div className="flex flex-col items-start justify-between gap-4 border-t border-b border-taupe/20 py-8 lg:flex-row lg:items-center">
          <div>
            <p className="text-eyebrow font-medium tracking-eyebrow text-taupe uppercase">
              Related
            </p>
            <p className="mt-2 max-w-lg text-body text-charcoal/80">
              Cake smash sessions are often paired with a baby or family
              session on the same day.
            </p>
          </div>
          <Cluster gap="sm" className="shrink-0">
            <Button href={routes.baby} variant="secondary" size="sm">
              Baby Photography
            </Button>
            <Button href={routes.family} variant="secondary" size="sm">
              Family Photography
            </Button>
          </Cluster>
        </div>
      </Section>

      <Section tone="plum">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-h2 text-white">Ready to book a cake smash session?</h2>
          <p className="mt-4 text-body-lg leading-relaxed text-white/80">
            Most families book around their child&apos;s first birthday —
            reach out to check available dates.
          </p>
          <Cluster gap="sm" align="center" justify="center" className="mt-8">
            <Button href={bookASessionCta.href} className="!bg-white !text-plum hover:!bg-blush">
              {bookASessionCta.label}
            </Button>
            <Button
              href={routes.cakeSmash}
              variant="secondary"
              className="!border-white/50 !text-white hover:!border-white hover:!bg-white/10"
            >
              Cake Smash Photography
            </Button>
          </Cluster>
        </div>
      </Section>
    </>
  );
}
