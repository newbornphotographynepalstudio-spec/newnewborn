import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { routes } from "@/lib/navigation/routes";

/** Helps parents unfamiliar with a photography studio feel comfortable
 * about visiting, without asserting specific facilities not yet confirmed. */
export function StudioSection() {
  return (
    <Section tone="blush" compact>
      <Reveal className="mx-auto max-w-2xl text-center">
        <SectionHeading
          align="center"
          eyebrow="The Studio"
          title="A calm space, made for newborns and families"
          description="Sessions are held in a private, newborn-friendly studio with controlled lighting and a relaxed pace — comfortable for your baby and for you."
        />
        <Button href={routes.studio} variant="text" className="mt-md">
          Visit the Studio
        </Button>
      </Reveal>
    </Section>
  );
}
