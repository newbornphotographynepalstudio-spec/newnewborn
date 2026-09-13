import Link from "next/link";

import { EditorialGrid } from "@/components/primitives/EditorialGrid";
import { Section } from "@/components/primitives/Section";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getServices, type ServiceSummary } from "@/lib/data/services";

/**
 * Photography-led tiles, not icon cards. None has an approved
 * category-specific photo yet, so all five get an honest tone placeholder
 * rather than invented photography — Newborn (the core service) gets its
 * "strongest visual emphasis" from a larger tile size instead.
 */
export function ServicesOverview() {
  const services = getServices();
  const [newborn, ...rest] = services;

  return (
    <Section tone="ivory">
      <SectionHeading
        eyebrow="Services"
        title="Photography for every stage"
        description="From your baby's first days to family milestones — one studio, five kinds of sessions."
      />

      <EditorialGrid className="mt-2xl">
        <div className="col-span-12 lg:col-span-6">
          <Reveal>
            <ServiceTile service={newborn} large />
          </Reveal>
        </div>
        <div className="col-span-12 grid grid-cols-1 gap-md sm:grid-cols-2 lg:col-span-6">
          {rest.map((service, index) => (
            <Reveal key={service.slug} delay={index * 75}>
              <ServiceTile service={service} />
            </Reveal>
          ))}
        </div>
      </EditorialGrid>
    </Section>
  );
}

function ServiceTile({
  service,
  large = false,
}: {
  service: ServiceSummary;
  large?: boolean;
}) {
  return (
    <Link href={service.href} className="group block">
      {service.image ? (
        <EditorialImage
          src={service.image}
          alt={service.imageAlt ?? service.name}
          aspect={large ? "landscape" : "square"}
          priority={large}
          sizes={large ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
          className="transition-transform duration-slow ease-premium group-hover:scale-[1.02]"
        />
      ) : (
        <div
          aria-hidden
          className={`flex ${large ? "aspect-[3/2]" : "aspect-square"} items-center justify-center bg-blush`}
        >
          <span className="text-caption tracking-eyebrow text-taupe uppercase">
            Photography coming soon
          </span>
        </div>
      )}
      <h3 className={`mt-sm ${large ? "text-h3" : "text-h4"} text-plum`}>{service.name}</h3>
      <p className="mt-3xs text-small text-charcoal/75">{service.description}</p>
    </Link>
  );
}
