import { Cluster } from "@/components/primitives/Cluster";
import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { bookASessionCta, routes } from "@/lib/navigation/routes";

export function FinalCta() {
  return (
    <Section tone="plum">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-display text-white">
          Let&apos;s preserve these little moments.
        </h2>
        <p className="mx-auto mt-md max-w-prose text-body-lg leading-relaxed text-white/80">
          Reach out to check availability and talk through your session —
          we&apos;d love to help you remember these days well.
        </p>
        <Cluster gap="sm" align="center" justify="center" className="mt-lg">
          <Button href={bookASessionCta.href} className="!bg-white !text-plum hover:!bg-blush">
            {bookASessionCta.label}
          </Button>
          <Button
            href={routes.contact}
            variant="secondary"
            className="!border-white/50 !text-white hover:!border-white hover:!bg-white/10"
          >
            Contact Us
          </Button>
        </Cluster>
      </Reveal>
    </Section>
  );
}
