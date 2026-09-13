import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { homeFaqPreview } from "@/lib/data/faq-preview";
import { routes } from "@/lib/navigation/routes";

/** Native <details>/<summary> — an accessible disclosure widget with no
 * custom JS, keyboard support or ARIA wiring needed. */
export function FaqPreview() {
  return (
    <Section tone="ivory" containerSize="prose">
      <SectionHeading eyebrow="FAQ" title="Common questions" align="center" />

      <div className="mt-xl divide-y divide-taupe/20 border-t border-b border-taupe/20">
        {homeFaqPreview.map((item, index) => (
          <Reveal key={item.id} delay={index * 50}>
            <details className="group py-md">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-md text-body-lg text-charcoal marker:content-none">
                {item.question}
                <span
                  aria-hidden
                  className="shrink-0 text-plum transition-transform duration-base group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-xs text-small leading-relaxed text-charcoal/75">
                {item.answer}
              </p>
            </details>
          </Reveal>
        ))}
      </div>

      <div className="mt-lg text-center">
        <Button href={routes.faq} variant="text">
          View All FAQ
        </Button>
      </div>
    </Section>
  );
}
