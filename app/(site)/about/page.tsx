import type { Metadata } from "next";

import { Cluster } from "@/components/primitives/Cluster";
import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/ui/Button";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { newbornGallery } from "@/lib/media/newborn-gallery";
import { bookASessionCta, routes } from "@/lib/navigation/routes";

/** The one newborn gallery photo not already used elsewhere outside the
 * full portfolio grid — keeps this page from being text-only. */
const aboutPhoto = newbornGallery.find((img) => img.id === "newborn-tutu-bed")!;

export const metadata: Metadata = {
  title: "About",
  description:
    "Newborn Photography Nepal is a photography studio in Kathmandu Valley offering newborn, maternity, baby, cake smash and family photography, plus training for photographers.",
  alternates: { canonical: routes.about },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Newborn Photography Nepal"
        description="A photography studio in Kathmandu Valley built around one thing: newborn photography done carefully, safely, and at your baby's pace."
      >
        <Cluster gap="sm" className="mt-8">
          <Button href={bookASessionCta.href}>{bookASessionCta.label}</Button>
          <Button href={routes.portfolio} variant="secondary">
            View Portfolio
          </Button>
        </Cluster>
      </PageHero>

      <Section compact>
        <Reveal>
          <EditorialImage
            src={aboutPhoto.src}
            alt={aboutPhoto.alt}
            aspect="wide"
            mobileAspect="portrait"
            position={aboutPhoto.objectPosition}
            sizes="100vw"
            rounded
          />
        </Reveal>
      </Section>

      <Section>
        <div className="mx-auto max-w-prose space-y-5">
          <p className="text-body-lg leading-relaxed text-charcoal/85">
            Newborn Photography Nepal grew out of a focus on one kind of
            session: newborns, photographed in the first days and weeks of
            life, in a studio built specifically for that purpose.
          </p>
          <p className="text-body-lg leading-relaxed text-charcoal/85">
            Maternity, baby, cake smash and family sessions all sit
            alongside that core focus: the same studio, the same
            unhurried approach, for the milestones that come before and
            after a newborn session.
          </p>
          <p className="text-body-lg leading-relaxed text-charcoal/85">
            The studio also runs newborn photography training for
            photographers who want to learn how to work with newborns
            safely and confidently.
          </p>
        </div>
      </Section>

      <Section tone="blush" compact>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-h3">Kathmandu Valley, Nepal</h2>
          <p className="mt-3 text-body leading-relaxed text-charcoal/80">
            Sessions are held primarily at the studio, with home sessions
            available where offered, for families across Kathmandu,
            Lalitpur and Bhaktapur.
          </p>
          <Button href={routes.areas} variant="text" className="mt-4">
            View Service Areas
          </Button>
        </div>
      </Section>
    </>
  );
}
