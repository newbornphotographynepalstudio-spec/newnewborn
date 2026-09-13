import { Cluster } from "@/components/primitives/Cluster";
import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { routes } from "@/lib/navigation/routes";

/** Deliberately smaller/quieter than the photography-service sections —
 * training is a real but secondary offering, not competing for attention. */
export function TrainingSection() {
  return (
    <Section compact>
      <Reveal className="flex flex-col items-start justify-between gap-md border-t border-b border-taupe/20 py-lg lg:flex-row lg:items-center">
        <div>
          <p className="text-eyebrow font-medium tracking-eyebrow text-taupe uppercase">
            For Photographers
          </p>
          <h2 className="mt-2xs text-h3">Newborn Photography Training</h2>
          <p className="mt-2xs max-w-lg text-small text-charcoal/75">
            For photographers who want to learn newborn photography safely,
            confidently and professionally.
          </p>
        </div>
        <Cluster gap="sm" className="shrink-0">
          <Button href={routes.training} variant="secondary" size="sm">
            Explore Training
          </Button>
        </Cluster>
      </Reveal>
    </Section>
  );
}
