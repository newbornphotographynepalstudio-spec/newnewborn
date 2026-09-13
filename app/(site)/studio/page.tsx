import type { Metadata } from "next";

import { Cluster } from "@/components/primitives/Cluster";
import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { bookASessionCta, routes } from "@/lib/navigation/routes";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "Inside the Newborn Photography Nepal studio in Kathmandu Valley — a private, newborn-friendly space with controlled lighting, built for a calm session.",
  alternates: { canonical: routes.studio },
};

const features = [
  {
    title: "A private space",
    description:
      "Sessions are one family at a time — no other clients coming or going, no waiting room.",
  },
  {
    title: "Controlled lighting",
    description:
      "Lighting is set up and adjusted through the session rather than relying on whatever daylight happens to be available.",
  },
  {
    title: "Kept warm for newborns",
    description:
      "The room is warmed ahead of newborn sessions specifically, since a comfortable temperature makes a real difference to how settled a baby is.",
  },
  {
    title: "Room to relax",
    description:
      "Seating and space for the rest of the family to wait comfortably, not just stand at the edge of the frame.",
  },
];

export default function StudioPage() {
  return (
    <>
      <PageHero
        eyebrow="The Studio"
        title="A calm space, built for newborns and families"
        description="Sessions are held primarily at the studio in Kathmandu Valley, with home sessions available where offered."
      >
        <Cluster gap="sm" className="mt-8">
          <Button href={bookASessionCta.href}>{bookASessionCta.label}</Button>
          <Button href={routes.safety} variant="secondary">
            Read About Safety
          </Button>
        </Cluster>
      </PageHero>

      <Section>
        <div className="grid grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2">
          {features.map((feature) => (
            <div key={feature.title}>
              <h2 className="text-h4 text-plum">{feature.title}</h2>
              <p className="mt-2 text-body leading-relaxed text-charcoal/80">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="blush" compact>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-h3">Not sure a studio session is right for you?</h2>
          <p className="mt-3 text-body leading-relaxed text-charcoal/80">
            Home sessions are available where offered — get in touch and we
            can talk through what would work best for your family.
          </p>
          <Button href={routes.contact} variant="text" className="mt-4">
            Contact Us
          </Button>
        </div>
      </Section>
    </>
  );
}
