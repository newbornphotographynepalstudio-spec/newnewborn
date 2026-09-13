import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/ui/Reveal";

/** A short editorial transition from the hero's visual attraction to an
 * emotional statement, before the site explains anything practical. */
export function BrandIntro() {
  return (
    <Section compact>
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-display">These first days pass quickly.</h2>
        <p className="mx-auto mt-6 max-w-prose text-body-lg leading-relaxed text-charcoal/80">
          Professional newborn photography preserves the tiny details — the
          fingers, the lashes, the quiet — as portraits your family will
          hold onto for years to come.
        </p>
      </Reveal>
    </Section>
  );
}
