import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { bookASessionCta, routes } from "@/lib/navigation/routes";

export default function HomePage() {
  return (
    <Container className="py-20 sm:py-32">
      <div className="max-w-2xl">
        <p className="text-sm font-medium tracking-wide text-ink-soft uppercase">
          Kathmandu Valley, Nepal
        </p>
        <h1 className="mt-3 text-4xl text-ink sm:text-6xl">
          Newborn Photography Nepal, by Navin
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-charcoal/80">
          A photography studio for newborn, maternity, baby, cake smash and
          family sessions — with training for photographers who want to work
          with newborns safely and beautifully.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href={bookASessionCta.href}
            className="rounded-sm bg-ink px-6 py-3 text-sm text-cream transition-colors hover:bg-ink-soft"
          >
            {bookASessionCta.label}
          </Link>
          <Link
            href={routes.portfolio}
            className="rounded-sm border border-ink px-6 py-3 text-sm text-ink transition-colors hover:bg-blush-soft"
          >
            View Portfolio
          </Link>
        </div>
        <p className="mt-10 inline-block rounded-sm border border-stone bg-stone-soft px-4 py-2 text-sm text-charcoal/60">
          Full homepage content, portfolio photography and pricing are being
          added.
        </p>
      </div>
    </Container>
  );
}
