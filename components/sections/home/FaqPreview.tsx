import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/ui/Button";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { homeFaqPreview } from "@/lib/data/faq-preview";
import { routes } from "@/lib/navigation/routes";

export function FaqPreview() {
  return (
    <Section tone="ivory" containerSize="prose">
      <SectionHeading eyebrow="FAQ" title="Common questions" align="center" />

      <Reveal className="mt-12">
        <FaqAccordion items={homeFaqPreview} />
      </Reveal>

      <div className="mt-8 text-center">
        <Button href={routes.faq} variant="text">
          View All FAQ
        </Button>
      </div>
    </Section>
  );
}
