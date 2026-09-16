import type { Metadata } from "next";

import { Cluster } from "@/components/primitives/Cluster";
import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/ui/Button";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { PageHero } from "@/components/ui/PageHero";
import { getFaqs } from "@/lib/faq/data";
import { bookASessionCta, routes, servicesNav } from "@/lib/navigation/routes";
import { faqPageJsonLd } from "@/lib/seo/jsonld";
import { buildPageMetadata } from "@/lib/seo/build-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata(routes.faq, {
    title: "Frequently Asked Questions",
    description:
      "Answers to common questions about booking, safety, session timing and what to expect from a session with Newborn Photography Nepal.",
  });
}

export default async function FaqPage() {
  const faqs = await getFaqs();
  const jsonLd = faqPageJsonLd(faqs);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        eyebrow="FAQ"
        title="Frequently Asked Questions"
        description="Answers to the questions parents ask most before booking a session."
      />

      <Section containerSize="prose">
        <FaqAccordion items={faqs} />

        <div className="mt-10">
          <p className="text-center text-caption tracking-eyebrow text-taupe uppercase">
            Related Sessions
          </p>
          <Cluster gap="sm" align="center" justify="center" className="mt-4">
            {servicesNav.map((service) => (
              <Button key={service.href} href={service.href} variant="secondary" size="sm">
                {service.label} Photography
              </Button>
            ))}
          </Cluster>
        </div>

        <div className="mt-10 text-center">
          <p className="text-body text-charcoal/75">Still have a question?</p>
          <Cluster gap="sm" align="center" justify="center" className="mt-4">
            <Button href={bookASessionCta.href}>{bookASessionCta.label}</Button>
            <Button href={routes.contact} variant="secondary">
              Contact Us
            </Button>
          </Cluster>
        </div>
      </Section>
    </>
  );
}
