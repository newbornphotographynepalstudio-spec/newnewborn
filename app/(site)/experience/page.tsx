import type { Metadata } from "next";
import Link from "next/link";

import { Cluster } from "@/components/primitives/Cluster";
import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/ui/Button";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { cakeSmashGallery } from "@/lib/media/cake-smash-gallery";
import { fullExperience, whatToBring } from "@/lib/data/full-experience";
import { newbornGallery } from "@/lib/media/newborn-gallery";
import { bookASessionCta, routes } from "@/lib/navigation/routes";
import { buildPageMetadata } from "@/lib/seo/build-metadata";

const introPhoto = newbornGallery.find((img) => img.id === "newborn-snail-basket")!;
const midPhoto = cakeSmashGallery.find((img) => img.id === "cakesmash-hand-raised")!;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata(routes.experience, {
    title: "The Full Session Experience",
    description:
      "Exactly what to expect before, during and after a session with Newborn Photography Nepal: planning, arrival, the session itself, and how your photos are delivered.",
  });
}

/** Splits the 10 stages into 3 visual groups so real photography can
 * break up the list, per the redesign's "photography-first, not a wall
 * of text" requirement — every stage's content is real, established
 * elsewhere in this codebase (see lib/data/full-experience.ts). */
const [groupOne, groupTwo, groupThree] = [
  fullExperience.slice(0, 4),
  fullExperience.slice(4, 7),
  fullExperience.slice(7),
];

function StageList({ stages }: { stages: typeof fullExperience }) {
  return (
    <div className="divide-y divide-taupe/20 border-t border-b border-taupe/20">
      {stages.map((stage) => (
        <Reveal key={stage.id}>
          <div className="grid grid-cols-1 gap-3 py-8 sm:grid-cols-12 sm:gap-6">
            <div className="sm:col-span-2">
              <p className="font-display text-h2 text-rose">{stage.number}</p>
            </div>
            <div className="sm:col-span-4">
              <h3 className="text-h4 text-plum">{stage.title}</h3>
            </div>
            <p className="text-body leading-relaxed text-charcoal/80 sm:col-span-6">
              {stage.description}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export default function ExperiencePage() {
  return (
    <>
      <PageHero
        eyebrow="The Experience"
        title="What Your Session Actually Feels Like"
        description="From the first conversation to the photos in your hands: every stage of a session, in order, so there's nothing to wonder about before you book."
      >
        <Cluster gap="sm" className="mt-8">
          <Button href={bookASessionCta.href}>{bookASessionCta.label}</Button>
          <Button href={routes.safety} variant="secondary">
            Read About Safety
          </Button>
        </Cluster>
      </PageHero>

      <Section compact>
        <Reveal>
          <EditorialImage
            src={introPhoto.src}
            alt={introPhoto.alt}
            aspect={introPhoto.desktopAspect}
            mobileAspect={introPhoto.mobileAspect}
            position={introPhoto.objectPosition}
            sizes="100vw"
            priority
            rounded
          />
        </Reveal>
      </Section>

      <Section>
        <StageList stages={groupOne} />
      </Section>

      <Section tone="ivory" compact>
        <div className="mx-auto max-w-2xl">
          <p className="text-center text-caption tracking-eyebrow text-taupe uppercase">
            What to Bring
          </p>
          <h2 className="mt-2 text-center text-h3">One less thing to plan for</h2>
          <ul className="mt-8 space-y-4">
            {whatToBring.map((item) => (
              <li key={item.service} className="border-b border-taupe/20 pb-4 last:border-b-0 last:pb-0">
                <Link href={item.href} className="font-medium text-plum underline-offset-4 hover:underline">
                  {item.service}
                </Link>
                <span className="font-medium text-plum">: </span>
                <span className="text-body text-charcoal/80">{item.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="blush" compact>
        <Reveal>
          <EditorialImage
            src={midPhoto.src}
            alt={midPhoto.alt}
            aspect={midPhoto.desktopAspect}
            mobileAspect={midPhoto.mobileAspect}
            position={midPhoto.objectPosition}
            sizes="100vw"
            rounded
          />
        </Reveal>
      </Section>

      <Section>
        <StageList stages={groupTwo} />
      </Section>

      <Section tone="ivory" compact>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-body-lg leading-relaxed text-charcoal/85">
            None of this replaces your own judgment as a parent. If
            anything about a session doesn&apos;t feel right, say so. The
            plan changes, not your baby.
          </p>
          <Button href={routes.safety} variant="text" className="mt-4">
            Read the Full Safety Approach
          </Button>
        </div>
      </Section>

      <Section>
        <StageList stages={groupThree} />
      </Section>

      <Section tone="plum">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-h1 text-white">Ready to book your session?</h2>
          <p className="mx-auto mt-4 max-w-prose text-body-lg leading-relaxed text-white/80">
            Now that you know what to expect, reach out to check
            availability and find the right time for your session.
          </p>
          <Cluster gap="sm" align="center" justify="center" className="mt-8">
            <Button href={bookASessionCta.href} className="!bg-white !text-plum hover:!bg-blush">
              {bookASessionCta.label}
            </Button>
            <Button
              href={routes.packages}
              variant="secondary"
              className="!border-white/50 !text-white hover:!border-white hover:!bg-white/10"
            >
              View Packages
            </Button>
          </Cluster>
        </div>
      </Section>
    </>
  );
}
