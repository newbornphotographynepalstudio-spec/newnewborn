import type { Metadata } from "next";

import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { portfolioCategories } from "@/lib/data/portfolio";
import { routes } from "@/lib/navigation/routes";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Newborn, maternity, baby, cake smash and family photography from Newborn Photography Nepal.",
  alternates: { canonical: routes.portfolio },
};

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="A look at the work"
        description="Galleries are organized by session type. The full portfolio is being built out as sessions are completed."
      />

      <Section>
        <div className="border-t border-taupe/20">
          {portfolioCategories.map((category, index) => (
            <a
              key={category.slug}
              href={category.href}
              className="group flex items-center justify-between gap-6 border-b border-taupe/20 py-6 lg:py-8"
            >
              <span className="flex items-baseline gap-4">
                <span className="text-caption text-taupe">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-h3 text-plum transition-colors duration-base group-hover:text-charcoal">
                  {category.name}
                </span>
              </span>
              <span aria-hidden className="text-plum transition-transform duration-base group-hover:translate-x-1">
                →
              </span>
            </a>
          ))}
        </div>
      </Section>

      <Section tone="blush" compact>
        <div className="mx-auto max-w-xl text-center">
          <p className="text-body leading-relaxed text-charcoal/80">
            Ready to be part of the next gallery?
          </p>
          <Button href={routes.bookASession} className="mt-4">
            Book a Session
          </Button>
        </div>
      </Section>
    </>
  );
}
