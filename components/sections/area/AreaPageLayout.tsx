import { Cluster } from "@/components/primitives/Cluster";
import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import type { AreaContent } from "@/lib/data/areas";
import { servicesNav } from "@/lib/navigation/routes";
import { bookASessionCta, routes } from "@/lib/navigation/routes";

export function AreaPageLayout({ content }: { content: AreaContent }) {
  return (
    <>
      <PageHero eyebrow="Service Area" title={content.h1}>
        <Cluster gap="sm" className="mt-8">
          <Button href={bookASessionCta.href}>{bookASessionCta.label}</Button>
          <Button href={routes.areas} variant="secondary">
            All Areas
          </Button>
        </Cluster>
      </PageHero>

      <Section>
        <div className="mx-auto max-w-prose space-y-4">
          {content.intro.map((paragraph) => (
            <p key={paragraph} className="text-body-lg leading-relaxed text-charcoal/80">
              {paragraph}
            </p>
          ))}
        </div>
      </Section>

      <Section tone="blush" compact>
        <p className="text-eyebrow font-medium tracking-eyebrow text-taupe uppercase">
          Sessions Available
        </p>
        <Cluster gap="md" className="mt-4">
          {servicesNav.map((service) => (
            <Button key={service.href} href={service.href} variant="secondary" size="sm">
              {service.label} Photography
            </Button>
          ))}
        </Cluster>
      </Section>
    </>
  );
}
