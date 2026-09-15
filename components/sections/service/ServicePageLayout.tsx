import { Cluster } from "@/components/primitives/Cluster";
import { EditorialGrid } from "@/components/primitives/EditorialGrid";
import { Section } from "@/components/primitives/Section";
import { LightboxImage } from "@/components/gallery/LightboxImage";
import { LightboxRoot } from "@/components/gallery/LightboxRoot";
import { Button } from "@/components/ui/Button";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { experienceSteps } from "@/lib/data/experience";
import type { ServicePageContent, ServiceSlug } from "@/lib/data/service-pages";
import { getPublishedMediaByCategory } from "@/lib/media/library-data";
import type { MediaLibraryCategory } from "@/lib/media/library-types";
import { bookASessionCta, routes } from "@/lib/navigation/routes";

/**
 * Shared structure for all five service pages — hero, intro, what's
 * included / why choose us, process, safety note, photography showcase,
 * FAQ, related services, final CTA. Content (copy, images, FAQs) is
 * entirely data-driven from lib/data/service-pages.ts; this component
 * only supplies the layout.
 *
 * The photography showcase prefers `content.showcaseImage` (the
 * approved static photo, only set for newborn/cake-smash today) but
 * falls back to the Media Library for any category without one —
 * maternity/baby/family have no static showcase image, so this is what
 * lets real uploaded/backfilled photography reach these pages without a
 * code change per category. Only the honest empty state renders when
 * neither exists.
 */
export async function ServicePageLayout({
  content,
  related,
}: {
  content: ServicePageContent;
  related: { slug: ServiceSlug; name: string; href: string }[];
}) {
  const bookingHref = `${bookASessionCta.href}?type=${content.slug}`;
  const libraryPhotos = content.showcaseImage
    ? []
    : await getPublishedMediaByCategory(content.slug as MediaLibraryCategory);

  return (
    <>
      <PageHero eyebrow={content.heroEyebrow} title={content.h1} description={content.heroDescription}>
        <Cluster gap="sm" className="mt-8">
          <Button href={bookingHref}>{bookASessionCta.label}</Button>
          <Button href={routes.portfolio} variant="secondary">
            View Portfolio
          </Button>
        </Cluster>
      </PageHero>

      <Section>
        <div className="mx-auto max-w-prose">
          <h2 className="text-h2">{content.introHeading}</h2>
          <div className="mt-5 space-y-4">
            {content.introParagraphs.map((paragraph) => (
              <p key={paragraph} className="text-body-lg leading-relaxed text-charcoal/80">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-2 border border-taupe/25 bg-blush/40 px-6 py-5 sm:flex-row sm:items-start sm:gap-4">
            <p className="shrink-0 text-caption font-medium tracking-eyebrow text-plum uppercase">
              When to Book
            </p>
            <p className="text-small leading-relaxed text-charcoal/85">{content.bestTiming}</p>
          </div>
        </div>
      </Section>

      <Section tone="blush">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-eyebrow font-medium tracking-eyebrow text-taupe uppercase">
              What&apos;s Included
            </p>
            <ul className="mt-4 space-y-3">
              {content.includes.map((item) => (
                <li key={item} className="border-b border-taupe/20 pb-3 text-body text-charcoal/85">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-eyebrow font-medium tracking-eyebrow text-taupe uppercase">
              Why Families Choose This Studio
            </p>
            <ul className="mt-4 space-y-3">
              {content.whyChoose.map((item) => (
                <li key={item} className="border-b border-taupe/20 pb-3 text-body text-charcoal/85">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="The Process" title="How a session comes together" />
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {experienceSteps.map((step) => (
            <div key={step.number}>
              <p className="font-display text-h2 text-rose">{step.number}</p>
              <h3 className="mt-2 text-h4 text-plum">{step.title}</h3>
              <p className="mt-2 text-small leading-relaxed text-charcoal/75">{step.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="ivory" compact>
        <div className="flex flex-col items-start justify-between gap-4 border-t border-b border-taupe/20 py-8 lg:flex-row lg:items-center">
          <div>
            <p className="text-eyebrow font-medium tracking-eyebrow text-taupe uppercase">Safety</p>
            <p className="mt-2 max-w-lg text-body text-charcoal/80">
              Every session is planned around your baby&apos;s comfort: baby-led
              posing, careful handling, and a controlled studio environment.
            </p>
          </div>
          <Button href={routes.safety} variant="secondary" size="sm" className="shrink-0">
            Learn About Safety
          </Button>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Photography" title={`${content.name} Portfolio`} />
        {content.showcaseImage ? (
          <>
            <Reveal className="mt-10">
              <EditorialImage
                src={content.showcaseImage}
                alt={content.showcaseAlt ?? content.name}
                aspect="wide"
                mobileAspect="landscape"
                rounded
              />
            </Reveal>
            <div className="mt-6">
              <Button href={routes.portfolio} variant="text">
                View Full Portfolio
              </Button>
            </div>
          </>
        ) : libraryPhotos.length > 0 ? (
          <LightboxRoot images={libraryPhotos.map((p) => ({ src: p.url, alt: p.alt }))}>
            <EditorialGrid className="mt-10">
              {libraryPhotos.slice(0, 6).map((photo, index) => (
                <div key={photo.id} className="col-span-6 sm:col-span-4">
                  <Reveal delay={index * 50}>
                    <LightboxImage src={photo.url} alt={photo.alt} aspect="square" rounded />
                  </Reveal>
                </div>
              ))}
            </EditorialGrid>
            <div className="mt-6">
              <Button href={routes.portfolio} variant="text">
                View Full Portfolio
              </Button>
            </div>
          </LightboxRoot>
        ) : (
          <Reveal className="mt-10">
            <div className="mx-auto max-w-xl border border-taupe/25 bg-blush/40 px-8 py-10 text-center">
              <p className="text-small leading-relaxed text-charcoal/75">
                A dedicated {content.name.toLowerCase()} gallery is being
                curated. In the meantime, real sessions from the studio,
                the same space, lighting and team, are in the portfolio.
              </p>
              <Button href={routes.portfolio} variant="text" className="mt-4">
                View the Portfolio
              </Button>
            </div>
          </Reveal>
        )}
      </Section>

      <Section tone="blush" containerSize="prose">
        <SectionHeading eyebrow="FAQ" title="Common questions" align="center" />
        <div className="mt-10">
          <FaqAccordion items={content.faqs} />
        </div>
      </Section>

      <Section compact>
        <p className="text-eyebrow font-medium tracking-eyebrow text-taupe uppercase">
          Related Sessions
        </p>
        <Cluster gap="md" className="mt-4">
          {related.map((item) => (
            <Button key={item.slug} href={item.href} variant="secondary" size="sm">
              {item.name} Photography
            </Button>
          ))}
        </Cluster>
      </Section>

      <Section tone="plum">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-h1 text-white">Ready to book your session?</h2>
          <p className="mx-auto mt-4 max-w-prose text-body-lg leading-relaxed text-white/80">
            Reach out to check availability. We&apos;ll help you find the
            right time for your {content.name.toLowerCase()} session.
          </p>
          <Cluster gap="sm" align="center" justify="center" className="mt-8">
            <Button href={bookingHref} className="!bg-white !text-plum hover:!bg-blush">
              {bookASessionCta.label}
            </Button>
            <Button
              href={routes.contact}
              variant="secondary"
              className="!border-white/50 !text-white hover:!border-white hover:!bg-white/10"
            >
              Contact Us
            </Button>
          </Cluster>
        </div>
      </Section>
    </>
  );
}
