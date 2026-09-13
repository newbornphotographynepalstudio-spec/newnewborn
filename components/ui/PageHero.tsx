import type { ReactNode } from "react";

import { Container } from "@/components/primitives/Container";

/**
 * The standard interior-page hero — eyebrow, H1, supporting paragraph,
 * optional actions. Plain ivory/blush background rather than a photo:
 * most interior pages don't have an approved category-specific photograph
 * yet, and a flat premium background reads more intentional than a
 * generic/stock image would.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  tone = "ivory",
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  tone?: "ivory" | "blush";
  children?: ReactNode;
}) {
  const bg = tone === "blush" ? "bg-blush" : "bg-ivory";

  return (
    <section className={`border-b border-taupe/15 ${bg}`}>
      <Container className="py-16 lg:py-24">
        <div className="max-w-3xl">
          <p className="text-eyebrow font-medium tracking-eyebrow text-taupe uppercase">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-h1">{title}</h1>
          {description ? (
            <p className="mt-5 max-w-2xl text-body-lg leading-relaxed text-charcoal/80">
              {description}
            </p>
          ) : null}
          {children}
        </div>
      </Container>
    </section>
  );
}
