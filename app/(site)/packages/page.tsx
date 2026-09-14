import type { Metadata } from "next";

import { Cluster } from "@/components/primitives/Cluster";
import { Section } from "@/components/primitives/Section";
import { Stack } from "@/components/primitives/Stack";
import { Button } from "@/components/ui/Button";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { contactInfo } from "@/lib/data/contact";
import { getServices } from "@/lib/data/services";
import { getPackages } from "@/lib/packages/data";
import { newbornGallery } from "@/lib/media/newborn-gallery";
import { bookASessionCta, contactLink, routes } from "@/lib/navigation/routes";

export const metadata: Metadata = {
  title: "Newborn Photography Packages & Pricing",
  description:
    "Newborn photography packages and pricing in Nepal: Mini, Premium and Luxury newborn session collections from Newborn Photography Nepal, Kathmandu.",
  alternates: { canonical: routes.packages },
};

const otherServices = getServices().filter((s) => s.slug !== "newborn");

/**
 * Three real newborn photos, each used exactly once elsewhere on the site
 * (service page, Studio, About) — reused here rather than repeated, in
 * three visually distinct styles (warm yellow, floral/purple, spa-robe)
 * so the page has photographic rhythm without three near-identical shots.
 */
const heroPhoto = newbornGallery.find((img) => img.id === "newborn-yellow-wrap")!;
const introPhoto = newbornGallery.find((img) => img.id === "newborn-tutu-bed")!;
const closingPhoto = newbornGallery.find((img) => img.id === "newborn-robe-chair")!;

export default async function PackagesPage() {
  const newbornPackages = await getPackages();
  return (
    <>
      <Section tone="ivory" compact className="border-b border-taupe/15">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="text-eyebrow font-medium tracking-eyebrow text-taupe uppercase">
              Newborn Photography Packages
            </p>
            <h1 className="mt-3 text-h1">
              Newborn photography packages designed around your family
            </h1>
            <p className="mt-5 max-w-xl text-body-lg leading-relaxed text-charcoal/80">
              Choose a short essential sitting, an unrushed premium session,
              or the complete luxury experience. Real pricing, shown here
              in full.
            </p>
            <Cluster gap="sm" className="mt-8 items-center">
              <Button href={`${bookASessionCta.href}?type=newborn`}>{bookASessionCta.label}</Button>
              <Button href={routes.newborn} variant="secondary">
                Newborn Photography
              </Button>
            </Cluster>
            <p className="mt-4 text-small text-taupe">
              Have questions?{" "}
              <a
                href={contactInfo.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-plum underline-offset-4 hover:underline"
              >
                WhatsApp us
              </a>
            </p>
          </div>
          <div className="lg:col-span-5">
            <Reveal>
              <EditorialImage
                src={heroPhoto.src}
                alt={heroPhoto.alt}
                aspect="landscape"
                mobileAspect="portrait"
                position={heroPhoto.objectPosition}
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                rounded
              />
            </Reveal>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <EditorialImage
                src={introPhoto.src}
                alt={introPhoto.alt}
                aspect="landscape"
                mobileAspect="portrait"
                position={introPhoto.objectPosition}
                sizes="(min-width: 1024px) 40vw, 100vw"
                rounded
              />
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <h2 className="text-h2">
              Choose the session that fits how you want to remember these
              first days.
            </h2>
            <p className="mt-5 text-body-lg leading-relaxed text-charcoal/80">
              Mini keeps things quick and simple for families who want a
              handful of beautiful portraits without a long session. Premium
              is the studio&apos;s most-booked collection: an unrushed
              sitting with more outfits, more images and a cinematic reel.
              Luxury is the complete experience, built for families who want
              every core moment covered and a premium printed keepsake to
              hold onto.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="blush">
        <SectionHeading
          eyebrow="Packages & Pricing"
          title="Newborn session packages"
          description="Three ways to book a newborn session, from a short essential sitting to the full luxury experience."
        />
        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-10">
          {newbornPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`pt-8 ${
                pkg.featured ? "border-t-2 border-plum" : "border-t border-taupe/20"
              }`}
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
              <h3 className="mt-2 text-h3 text-plum">{pkg.name}</h3>
              <p
                className={`mt-3 font-display text-h1 whitespace-nowrap ${
                  pkg.featured ? "text-plum" : ""
                }`}
              >
                {pkg.priceLabel}
              </p>
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
                href={`${pkg.href}?type=newborn&package=${encodeURIComponent(pkg.name)}`}
                variant={pkg.featured ? "primary" : "secondary"}
                className="mt-8 w-full justify-center"
              >
                Book This Package
              </Button>
            </div>
          ))}
        </div>
      </Section>

      <Section compact>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="text-h3">Not sure which collection is right for you?</h2>
            <p className="mt-3 max-w-prose text-body leading-relaxed text-charcoal/80">
              Every family is different. Talk to us about your session and
              we&apos;ll help you choose.
            </p>
            <Cluster gap="sm" className="mt-6">
              <Button href={contactLink.href}>Talk to Us</Button>
              <Button
                href={contactInfo.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
              >
                WhatsApp Us
              </Button>
            </Cluster>
          </div>
          <div className="lg:col-span-5">
            <Reveal>
              <EditorialImage
                src={closingPhoto.src}
                alt={closingPhoto.alt}
                aspect="portrait"
                mobileAspect="landscape"
                position={closingPhoto.objectPosition}
                sizes="(min-width: 1024px) 40vw, 100vw"
                rounded
              />
            </Reveal>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Other Sessions"
          title="Maternity, baby, cake smash and family"
          description="Packages for these sessions aren't published yet. Pricing is shared when you get in touch."
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
            frame or album. Additional albums, frames and prints can also
            be added to any session, discussed when you book.
          </p>
        </div>
      </Section>
    </>
  );
}
