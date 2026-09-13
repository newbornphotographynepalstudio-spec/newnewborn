import type { Metadata } from "next";

import { Cluster } from "@/components/primitives/Cluster";
import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { contactInfo } from "@/lib/data/contact";
import { getServices } from "@/lib/data/services";
import { routes } from "@/lib/navigation/routes";

export const metadata: Metadata = {
  title: "Packages",
  description:
    "Photography packages, premium albums, frames and prints from Newborn Photography Nepal — full pricing available on request.",
  alternates: { canonical: routes.packages },
};

export default function PackagesPage() {
  const services = getServices();

  return (
    <>
      <PageHero
        eyebrow="Packages & Pricing"
        title="Photography packages"
        description="Session packages are available for every service, along with premium albums, frames and prints. Full pricing details are being finalized for this page — reach out directly for current rates."
      >
        <Cluster gap="sm" className="mt-8">
          <Button href={`mailto:${contactInfo.email}`}>Ask About Pricing</Button>
          <Button href={routes.bookASession} variant="secondary">
            Book a Session
          </Button>
        </Cluster>
      </PageHero>

      <Section>
        <SectionHeading eyebrow="Sessions" title="Available for every service" />
        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-6 border-t border-taupe/20 pt-8 sm:grid-cols-2 lg:grid-cols-5">
          {services.map((service) => (
            <div key={service.slug}>
              <h3 className="text-h4 text-plum">{service.name}</h3>
              <p className="mt-2 text-small text-charcoal/75">{service.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="blush" compact>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-h3">Albums, frames and prints</h2>
          <p className="mt-3 text-body leading-relaxed text-charcoal/80">
            Beyond the digital gallery, premium albums, frames and prints
            are available as an add-on to any session — details are shared
            when you book.
          </p>
        </div>
      </Section>
    </>
  );
}
