import { Section } from "@/components/primitives/Section";
import { Stack } from "@/components/primitives/Stack";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { routes } from "@/lib/navigation/routes";

const safetyPoints = [
  "Baby-led posing — nothing is ever forced",
  "Trained, careful handling throughout the session",
  "A controlled, warm studio environment",
  "Clean equipment, props and set-ups",
  "Parents present and involved at every step",
];

/** No medical or certification claims — only the general safety practices
 * already provided as approved concepts for this section. */
export function SafetySection() {
  return (
    <Section tone="ivory">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal>
            <SectionHeading
              eyebrow="Safety"
              title="Your baby's safety comes first"
              description="Every session is planned and run around your baby's comfort, from posing to the studio environment itself."
            />
            <Button href={routes.safety} variant="text" className="mt-6">
              Learn About Safety
            </Button>
          </Reveal>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <Reveal delay={75}>
            <Stack gap="sm" as="ul">
              {safetyPoints.map((point) => (
                <li
                  key={point}
                  className="border-b border-taupe/20 pb-4 text-body-lg text-charcoal/85 last:border-b-0"
                >
                  {point}
                </li>
              ))}
            </Stack>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
