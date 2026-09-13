import type { Metadata } from "next";

import { Cluster } from "@/components/primitives/Cluster";
import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/ui/Button";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { PageHero } from "@/components/ui/PageHero";
import { fullFaqList } from "@/lib/data/faq-full";
import { bookASessionCta, routes } from "@/lib/navigation/routes";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about booking, safety, session timing and what to expect from a session with Newborn Photography Nepal.",
  alternates: { canonical: routes.faq },
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Frequently Asked Questions"
        description="Answers to the questions parents ask most before booking a session."
      />

      <Section containerSize="prose">
        <FaqAccordion items={fullFaqList} />
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
