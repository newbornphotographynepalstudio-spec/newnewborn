import type { Metadata } from "next";

import { Cluster } from "@/components/primitives/Cluster";
import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { contactInfo } from "@/lib/data/contact";
import { routes } from "@/lib/navigation/routes";

export const metadata: Metadata = {
  title: "Newborn Photography Training",
  description:
    "Newborn photography training for photographers who want to learn safe handling, posing and studio setup, taught in Kathmandu.",
  alternates: { canonical: routes.training },
};

const topics = [
  {
    title: "Safe handling and posing",
    description:
      "How to support a newborn through a pose safely, when to stop, and how to work with — not against — a baby who won't settle.",
  },
  {
    title: "Studio setup and lighting",
    description: "Building a warm, safe set-up and lighting it consistently for newborn skin tones.",
  },
  {
    title: "Working with parents",
    description:
      "How to run a session that keeps parents comfortable and involved, not sidelined in their own baby's photos.",
  },
  {
    title: "Editing for a newborn skin",
    description: "A practical look at retouching that stays natural rather than over-processed.",
  },
];

export default function TrainingPage() {
  return (
    <>
      <PageHero
        eyebrow="For Photographers"
        title="Newborn Photography Training"
        description="For photographers who want to learn newborn photography safely, confidently and professionally."
      >
        <Cluster gap="sm" className="mt-8">
          <Button href={`mailto:${contactInfo.email}`}>Ask About Training</Button>
          <Button href={routes.safety} variant="secondary">
            Our Safety Approach
          </Button>
        </Cluster>
      </PageHero>

      <Section>
        <SectionHeading eyebrow="What's Covered" title="A practical, hands-on approach" />
        <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2">
          {topics.map((topic) => (
            <div key={topic.title}>
              <h3 className="text-h4 text-plum">{topic.title}</h3>
              <p className="mt-2 text-body leading-relaxed text-charcoal/80">
                {topic.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="plum" compact>
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-h3 text-white">Interested in training?</h2>
          <p className="mt-3 text-body leading-relaxed text-white/80">
            Upcoming dates and formats are shared directly — reach out to ask
            what&apos;s currently available.
          </p>
          <Button
            href={`mailto:${contactInfo.email}`}
            className="mt-6 !bg-white !text-plum hover:!bg-blush"
          >
            Ask About Training
          </Button>
        </div>
      </Section>
    </>
  );
}
