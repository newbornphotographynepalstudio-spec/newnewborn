import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { experienceSteps } from "@/lib/data/experience";

/** Calm, ordered explanation of the session journey — reduces uncertainty
 * for parents who haven't been to a photography studio before. */
export function ExperienceSteps() {
  return (
    <Section tone="ivory">
      <SectionHeading
        eyebrow="The Experience"
        title="What to expect"
        description="A calm, unhurried process from the first conversation to the finished artwork."
      />

      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
        {experienceSteps.map((step, index) => (
          <Reveal key={step.number} delay={index * 75}>
            <p className="font-display text-h2 text-rose">{step.number}</p>
            <h3 className="mt-2 text-h4 text-plum">{step.title}</h3>
            <p className="mt-2 text-small leading-relaxed text-charcoal/75">
              {step.description}
            </p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
