import { Section } from "@/components/primitives/Section";
import { ServiceCategoryCard } from "@/components/ui/ServiceCategoryCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getServices, type ServiceSummary } from "@/lib/data/services";
import { getPublishedMediaByCategory } from "@/lib/media/library-data";
import type { MediaLibraryCategory } from "@/lib/media/library-types";

/**
 * A photo-forward category grid — photography-first, per the redesign
 * direction (a customer should see real work quality early, not just
 * read an editorial text list). Newborn and Cake Smash already have an
 * approved static photo (see lib/data/services.ts); Maternity/Baby/
 * Family check the Supabase Media Library for a published photo in that
 * category at render time, and fall back to an honest "gallery being
 * curated" state (via ServiceCategoryCard) when neither exists — never
 * invented photography for a category with no real work yet.
 */
async function withMediaLibraryFallback(service: ServiceSummary): Promise<ServiceSummary> {
  if (service.image) return service;
  const uploaded = await getPublishedMediaByCategory(service.slug as MediaLibraryCategory);
  const first = uploaded[0];
  if (!first) return service;
  return { ...service, image: first.url, imageAlt: first.alt };
}

export async function ServicesOverview() {
  const services = await Promise.all(getServices().map(withMediaLibraryFallback));

  return (
    <Section>
      <SectionHeading
        eyebrow="Services"
        title="Photography for every stage"
        description="From your baby's first days to family milestones: one studio, five kinds of sessions."
      />

      <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
        {services.map((service, index) => (
          <ServiceCategoryCard
            key={service.slug}
            name={service.name}
            description={service.description}
            href={service.href}
            image={service.image}
            imageAlt={service.imageAlt}
            featured={service.featured}
            delay={index * 60}
          />
        ))}
      </div>
    </Section>
  );
}
