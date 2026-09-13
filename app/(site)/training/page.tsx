import type { Metadata } from "next";

import { Cluster } from "@/components/primitives/Cluster";
import { Section } from "@/components/primitives/Section";
import { Stack } from "@/components/primitives/Stack";
import { Button } from "@/components/ui/Button";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { trainingAudience, trainingCourses, trainingFaqs } from "@/lib/data/training";
import { routes } from "@/lib/navigation/routes";

export const metadata: Metadata = {
  title: "Newborn Photography Training in Nepal",
  description:
    "Newborn photography training in Nepal — hands-on courses covering safety, wrapping, posing, lighting and studio workflow, from beginner to professional.",
  alternates: { canonical: routes.training },
};

const learningThemes = [
  {
    title: "Safety & handling",
    description: "Reading a baby's cues, safe spotting, and knowing when to pause or change a pose.",
  },
  {
    title: "Wrapping",
    description: "From foundational wraps to advanced, fast, parent-requested styles.",
  },
  {
    title: "Posing",
    description: "Wrapped and bucket poses through to composite and family posing.",
  },
  {
    title: "Lighting & camera technique",
    description: "Window light, continuous light and flash, shadow control and lens selection.",
  },
  {
    title: "Studio workflow",
    description: "Running a session timeline, and working through a baby who won't settle.",
  },
  {
    title: "Editing & business",
    description:
      "Retouching workflow through to pricing, branding and marketing — covered in the Professional and Master courses.",
  },
];

const nextSteps = [
  { number: "01", title: "Enquire", description: "Tell us your experience level and which course interests you." },
  {
    number: "02",
    title: "Talk it through",
    description: "We'll confirm the right course, current pricing and available start dates.",
  },
  { number: "03", title: "Begin training", description: "Start your course, including live session participation." },
];

export default function TrainingPage() {
  return (
    <>
      <PageHero eyebrow="Newborn Photography Training — Kathmandu, Nepal" title="Learn newborn photography with safety, patience and intention.">
        <p className="mt-5 max-w-2xl text-body-lg leading-relaxed text-charcoal/80">
          Hands-on training for photographers in Nepal — from a first
          introduction to newborn handling through to running a
          professional newborn photography business.
        </p>
        <Cluster gap="sm" className="mt-8">
          <Button href={routes.bookASession}>Enquire About Training</Button>
          <Button href={routes.safety} variant="secondary">
            Our Safety Approach
          </Button>
        </Cluster>
      </PageHero>

      <Section>
        <SectionHeading eyebrow="Who This Is For" title="Training for wherever you're starting from" />
        <div className="mt-10 grid grid-cols-1 gap-x-12 gap-y-3 sm:grid-cols-2">
          {trainingAudience.map((item) => (
            <p key={item} className="border-b border-taupe/20 py-3 text-body text-charcoal/85">
              {item}
            </p>
          ))}
        </div>
      </Section>

      <Section tone="blush">
        <SectionHeading eyebrow="What You'll Learn" title="A practical curriculum, not just theory" />
        <div className="mt-10 grid grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2">
          {learningThemes.map((theme) => (
            <div key={theme.title}>
              <h3 className="text-h4 text-plum">{theme.title}</h3>
              <p className="mt-2 text-body leading-relaxed text-charcoal/80">{theme.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-eyebrow font-medium tracking-eyebrow text-taupe uppercase">
            The Hands-On Experience
          </p>
          <h2 className="mt-3 text-h2">You learn by being in the room</h2>
          <p className="mx-auto mt-5 max-w-prose text-body-lg leading-relaxed text-charcoal/80">
            Every course includes live session participation — starting by
            observing a real newborn session, moving on to assisting with
            wrapping and posing, and in the longer courses, leading a
            session under supervision. Reading, watching and doing are
            treated as three different skills.
          </p>
        </div>
      </Section>

      <Section tone="ivory">
        <SectionHeading
          eyebrow="Training Courses"
          title="Three courses, depending on where you're starting"
          description="No price is listed here — every course ends in a conversation about the right fit, current pricing and available dates."
        />
        <Stack gap="3xl" className="mt-16">
          {trainingCourses.map((course, index) => (
            <div key={course.id} className="border-t border-taupe/20 pt-10">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <p className="text-caption text-taupe">{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-2 text-h3 text-plum">{course.name}</h3>
                  <p className="mt-2 text-small text-taupe">{course.duration}</p>
                  <p className="mt-4 text-body text-charcoal/80">{course.outcome}</p>
                  <Stack gap="2xs" className="mt-4">
                    {course.audience.map((a) => (
                      <p key={a} className="text-small text-charcoal/70">
                        — {a}
                      </p>
                    ))}
                  </Stack>
                  <Button href={routes.bookASession} variant="text" className="mt-6">
                    Enquire About This Course
                  </Button>
                </div>
                <div className="lg:col-span-8">
                  <p className="text-caption tracking-eyebrow text-taupe uppercase">Included</p>
                  <p className="mt-2 text-small text-charcoal/80">{course.included.join(" · ")}</p>
                  <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                    {course.modules.map((mod) => (
                      <div key={mod.title}>
                        <h4 className="text-small font-medium text-plum">{mod.title}</h4>
                        <ul className="mt-1 space-y-1">
                          {mod.points.map((point) => (
                            <li key={point} className="text-caption leading-relaxed text-charcoal/70">
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Stack>
      </Section>

      <Section tone="blush" compact>
        <SectionHeading eyebrow="What to Expect" title="What happens after you enquire" align="center" />
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {nextSteps.map((step) => (
            <div key={step.number} className="text-center">
              <p className="font-display text-h2 text-rose">{step.number}</p>
              <h3 className="mt-2 text-h4 text-plum">{step.title}</h3>
              <p className="mt-2 text-small leading-relaxed text-charcoal/75">{step.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section containerSize="prose">
        <SectionHeading eyebrow="FAQ" title="Common questions" align="center" />
        <div className="mt-10">
          <FaqAccordion items={trainingFaqs} />
        </div>
      </Section>

      <Section tone="plum">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-h2 text-white">Ready to start training?</h2>
          <p className="mt-4 text-body-lg leading-relaxed text-white/80">
            Enquire with your experience level and the course you&apos;re
            considering — we&apos;ll take it from there.
          </p>
          <Button href={routes.bookASession} className="mt-8 !bg-white !text-plum hover:!bg-blush">
            Enquire About Training
          </Button>
        </div>
      </Section>
    </>
  );
}
