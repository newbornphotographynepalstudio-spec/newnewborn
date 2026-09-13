import type { Metadata } from "next";

import { Cluster } from "@/components/primitives/Cluster";
import { Section } from "@/components/primitives/Section";
import { Stack } from "@/components/primitives/Stack";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { bookASessionCta, routes } from "@/lib/navigation/routes";

export const metadata: Metadata = {
  title: "Newborn Safety",
  description:
    "How newborn safety is built into every session — baby-led posing, trained handling, a controlled studio environment, and parents present throughout.",
  alternates: { canonical: routes.safety },
};

const principles = [
  {
    title: "Baby-led posing",
    description:
      "No pose is forced. If a baby is unsettled in a position, the session moves to something calmer rather than pushing through it.",
  },
  {
    title: "Trained, careful handling",
    description:
      "Every pose is supported by hand throughout, with a spotter present for anything more elaborate than a simple wrap.",
  },
  {
    title: "A controlled studio environment",
    description:
      "The room is kept warm for newborn comfort, with consistent lighting and a quiet setting that doesn't overstimulate a young baby.",
  },
  {
    title: "Clean equipment and props",
    description:
      "Props, wraps and surfaces are cleaned between sessions, and nothing is used that hasn't been checked for a newborn's safety first.",
  },
  {
    title: "Parents present throughout",
    description:
      "You're in the room for the entire session — able to step in, ask for a break, or simply watch from close by.",
  },
];

export default function SafetyPage() {
  return (
    <>
      <PageHero
        eyebrow="Safety"
        title="Newborn safety comes first"
        description="Every session is planned and run around your baby's comfort — not the other way around. Here's what that actually means in the studio."
      >
        <Cluster gap="sm" className="mt-8">
          <Button href={bookASessionCta.href}>{bookASessionCta.label}</Button>
          <Button href={routes.studio} variant="secondary">
            About the Studio
          </Button>
        </Cluster>
      </PageHero>

      <Section>
        <SectionHeading eyebrow="Our Approach" title="What safety looks like in practice" />
        <Stack gap="lg" className="mt-12 max-w-3xl">
          {principles.map((principle) => (
            <div key={principle.title} className="border-b border-taupe/20 pb-6">
              <h3 className="text-h4 text-plum">{principle.title}</h3>
              <p className="mt-2 text-body leading-relaxed text-charcoal/80">
                {principle.description}
              </p>
            </div>
          ))}
        </Stack>
      </Section>

      <Section tone="blush" compact>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-body-lg leading-relaxed text-charcoal/85">
            None of this replaces your own judgment as a parent. If anything
            about a session doesn&apos;t feel right, say so — the plan changes,
            not your baby.
          </p>
        </div>
      </Section>
    </>
  );
}
