import type { ReactNode } from "react";

import { Section } from "@/components/primitives/Section";

/**
 * Stand-in for routes whose real content (copy, photography, pricing) has
 * not been supplied yet. Every required public route renders through this
 * so the route/navigation/SEO scaffolding is real and buildable without
 * inventing business content — restyled onto the Phase 2 design system
 * (typography, spacing, color tokens) but still an honest placeholder.
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
    <Section compact>
      <div className="max-w-prose">
        {eyebrow ? (
          <p className="text-eyebrow font-medium tracking-eyebrow text-taupe uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-xs text-h1">{title}</h1>
        <p className="mt-sm text-body-lg leading-relaxed text-charcoal/80">
          {description}
        </p>
        <p className="mt-lg inline-block rounded-sm border border-taupe/30 bg-blush px-sm py-2xs text-small text-charcoal/70">
          Content for this page is in progress and will be added by Newborn
          Photography Nepal.
        </p>
        {children}
      </div>
    </Section>
  );
}
