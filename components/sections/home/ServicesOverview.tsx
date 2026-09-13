import Link from "next/link";

import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getServices } from "@/lib/data/services";

/**
 * An editorial list rather than icon cards or repeated "coming soon"
 * image boxes — with no approved category-specific photography yet, five
 * near-identical placeholder tiles would read as more unfinished than a
 * confident, typography-led list. Newborn (the core service) gets its
 * emphasis from being first and from the small "Core Service" tag, not
 * from a bigger box.
 */
export function ServicesOverview() {
  const services = getServices();

  return (
    <Section>
      <SectionHeading
        eyebrow="Services"
        title="Photography for every stage"
        description="From your baby's first days to family milestones — one studio, five kinds of sessions."
      />

      <div className="mt-12 border-t border-taupe/20">
        {services.map((service, index) => (
          <Reveal key={service.slug} delay={index * 60}>
            <Link
              href={service.href}
              className="group grid grid-cols-1 items-baseline gap-2 border-b border-taupe/20 py-6 lg:grid-cols-12 lg:gap-6 lg:py-8"
            >
              <div className="flex items-baseline gap-4 lg:col-span-5">
                <span className="text-caption text-taupe">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="text-h3 text-plum transition-colors duration-base group-hover:text-charcoal">
                  {service.name}
                </h3>
              </div>
              <p className="text-body-lg text-charcoal/75 lg:col-span-6">{service.description}</p>
              <span className="text-small font-medium text-plum lg:col-span-1 lg:text-right">
                {service.featured ? "Core Service" : "Learn more →"}
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
