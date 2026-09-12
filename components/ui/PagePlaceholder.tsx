import type { ReactNode } from "react";

import { Container } from "@/components/ui/Container";

/**
 * Phase 1 stand-in for routes whose real content (copy, photography,
 * pricing) has not been supplied yet. Every required public route renders
 * through this so the route/navigation/SEO scaffolding is real and
 * buildable without inventing business content.
 */
export function PagePlaceholder({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <Container className="py-20 sm:py-28">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="text-sm font-medium tracking-wide text-ink-soft uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-3 text-4xl text-ink sm:text-5xl">{title}</h1>
        <p className="mt-5 text-base leading-relaxed text-charcoal/80">
          {description}
        </p>
        <p className="mt-8 inline-block rounded-sm border border-stone bg-stone-soft px-4 py-2 text-sm text-charcoal/60">
          Content for this page is in progress and will be added by Newborn
          Photography Nepal.
        </p>
        {children}
      </div>
    </Container>
  );
}
