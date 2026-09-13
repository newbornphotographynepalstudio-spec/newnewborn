import { EditorialGrid } from "@/components/primitives/EditorialGrid";
import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getServices } from "@/lib/data/services";
import { packages } from "@/lib/data/packages";
import { routes } from "@/lib/navigation/routes";

/** No price is ever hard-coded — renders real package tiles once
 * lib/data/packages.ts is populated, or a designed placeholder (the five
 * real session types, no invented pricing) until then. */
export function PackagesPreview() {
  const services = getServices();

  return (
    <Section tone="ivory">
      <SectionHeading
        eyebrow="Packages"
        title="Photography packages"
        description="Session packages, premium albums, frames and prints — full pricing details are being finalized."
      />

      {packages.length > 0 ? (
        <EditorialGrid className="mt-16">
          {packages.map((pkg) => (
            <div key={pkg.id} className="col-span-12 sm:col-span-6 lg:col-span-4">
              <h3 className="text-h4 text-plum">{pkg.name}</h3>
              <p className="mt-2 text-small text-charcoal/75">{pkg.tagline}</p>
              {pkg.priceFrom ? (
                <p className="mt-3 text-small text-taupe">From {pkg.priceFrom}</p>
              ) : null}
            </div>
          ))}
        </EditorialGrid>
      ) : (
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-taupe/20 pt-8 sm:grid-cols-3 lg:grid-cols-5">
          {services.map((service) => (
            <div key={service.slug}>
              <p className="text-small font-medium text-plum">{service.name}</p>
              <p className="mt-1 text-caption text-taupe">Pricing on request</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10">
        <Button href={routes.packages} variant="text">
          View Packages
        </Button>
      </div>
    </Section>
  );
}
