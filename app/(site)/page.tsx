import { Cluster } from "@/components/primitives/Cluster";
import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/ui/Button";
import { bookASessionCta, routes } from "@/lib/navigation/routes";

/**
 * Still a placeholder hero, not the final homepage (Phase 2 is design
 * system + UI foundation only — see docs/DESIGN-SYSTEM.md). Restyled onto
 * the new type scale, spacing and Button/Section primitives so the
 * foundation is demonstrably working, without inventing final copy or
 * placing any photography here yet.
 */
export default function HomePage() {
  return (
    <Section>
      <div className="max-w-3xl">
        <p className="text-eyebrow font-medium tracking-eyebrow text-taupe uppercase">
          Kathmandu Valley, Nepal
        </p>
        <h1 className="mt-sm text-display">
          Newborn Photography Nepal, by Navin
        </h1>
        <p className="mt-md max-w-prose text-body-lg leading-relaxed text-charcoal/80">
          A photography studio for newborn, maternity, baby, cake smash and
          family sessions — with training for photographers who want to work
          with newborns safely and beautifully.
        </p>
        <Cluster gap="sm" className="mt-lg">
          <Button href={bookASessionCta.href}>{bookASessionCta.label}</Button>
          <Button href={routes.portfolio} variant="secondary">
            Explore Portfolio
          </Button>
        </Cluster>
        <p className="mt-2xl inline-block rounded-sm border border-taupe/30 bg-blush px-sm py-2xs text-small text-charcoal/70">
          Full homepage content, portfolio photography and pricing are being
          added.
        </p>
      </div>
    </Section>
  );
}
