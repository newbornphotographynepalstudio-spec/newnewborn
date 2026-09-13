import type { Metadata } from "next";

import { Cluster } from "@/components/primitives/Cluster";
import { Section } from "@/components/primitives/Section";
import { Stack } from "@/components/primitives/Stack";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { newbornPackages } from "@/lib/data/packages";
import { getServices } from "@/lib/data/services";
import { bookASessionCta, contactLink, routes } from "@/lib/navigation/routes";

export const metadata: Metadata = {
  title: "Newborn Photography Packages & Pricing",
  description:
    "Newborn photography packages and pricing in Nepal — Mini, Premium and Luxury newborn session collections from Newborn Photography Nepal, Kathmandu.",
  alternates: { canonical: routes.packages },
};

const otherServices = getServices().filter((s) => s.slug !== "newborn");

export default function PackagesPage() {
  return (
    <>
      <PageHero
        eyebrow="Packages & Pricing"
        title="Newborn photography packages"
        description="Three newborn session collections, from a short essential sitting to the full luxury experience — real pricing, shown here in full."
      >
        <Cluster gap="sm" className="mt-8">
          <Button href={bookASessionCta.href}>{bookASessionCta.label}</Button>
          <Button href={routes.newborn} variant="secondary">
            Newborn Photography
          </Button>
        </Cluster>
      </PageHero>

      <Section>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-10">
          {newbornPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`border-t pt-8 ${pkg.featured ? "border-plum" : "border-taupe/20"}`}
            >
              {pkg.featured ? (
                <p className="text-caption font-medium tracking-eyebrow text-plum uppercase">
                  Most Chosen
                </p>
              ) : (
                <p className="text-caption tracking-eyebrow text-taupe uppercase">
                  {pkg.id === "luxury" ? "Premium Experience" : "Essential"}
                </p>
              )}
              <h2 className="mt-2 text-h3 text-plum">{pkg.name}</h2>
              <p className="mt-3 font-display text-h1 whitespace-nowrap">{pkg.priceLabel}</p>
              <p className="mt-3 text-body text-charcoal/75">{pkg.tagline}</p>

              <dl className="mt-6 space-y-2 border-t border-taupe/20 pt-4 text-small">
                <div className="flex justify-between gap-4">
                  <dt className="text-taupe">Duration</dt>
                  <dd className="text-right text-charcoal">{pkg.duration}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-taupe">Setups</dt>
                  <dd className="text-right text-charcoal">{pkg.setups}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-taupe">Photos</dt>
                  <dd className="text-right text-charcoal">{pkg.editedPhotos}</dd>
                </div>
              </dl>

              <Stack gap="2xs" className="mt-6 border-t border-taupe/20 pt-4">
                {pkg.includes.map((item) => (
                  <p key={item} className="text-small text-charcoal/80">
                    {item}
                  </p>
                ))}
              </Stack>

              <Button
                href={pkg.href}
                variant={pkg.featured ? "primary" : "secondary"}
                className="mt-8 w-full justify-center"
              >
                Book This Package
              </Button>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="blush" compact>
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-h3">Not sure which collection is right for you?</h2>
          <p className="mt-3 text-body leading-relaxed text-charcoal/80">
            Every family is different — talk to us about your session and
            we&apos;ll help you choose.
          </p>
          <Button href={contactLink.href} className="mt-6">
            Talk to Us
          </Button>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Other Sessions"
          title="Maternity, baby, cake smash and family"
          description="Packages for these sessions aren't published yet — pricing is shared when you get in touch."
        />
        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-6 border-t border-taupe/20 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {otherServices.map((service) => (
            <div key={service.slug}>
              <h3 className="text-h4 text-plum">{service.name}</h3>
              <p className="mt-2 text-small text-charcoal/75">{service.description}</p>
              <Button href={service.href} variant="text" className="mt-3">
                {service.name} Photography
              </Button>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="ivory" compact>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-h3">Albums, frames and prints</h2>
          <p className="mt-3 text-body leading-relaxed text-charcoal/80">
            The Premium and Luxury newborn packages already include a
            frame or album — additional albums, frames and prints can also
            be added to any session, discussed when you book.
          </p>
        </div>
      </Section>
    </>
  );
}
