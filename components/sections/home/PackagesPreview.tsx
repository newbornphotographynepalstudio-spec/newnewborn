import { EditorialGrid } from "@/components/primitives/EditorialGrid";
import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { packages } from "@/lib/data/packages";
import { routes } from "@/lib/navigation/routes";

/** No price is ever hard-coded — renders real package tiles once
 * `lib/data/packages.ts` is populated (Firebase, a later phase), or an
 * honest placeholder until then. */
export function PackagesPreview() {
  return (
    <Section tone="ivory">
      <SectionHeading
        eyebrow="Packages"
        title="Photography packages"
        description="Session packages, premium albums, frames and prints — full pricing details are being finalized."
      />

      {packages.length > 0 ? (
        <EditorialGrid className="mt-2xl">
          {packages.map((pkg) => (
            <div key={pkg.id} className="col-span-12 sm:col-span-6 lg:col-span-4">
              <h3 className="text-h4 text-plum">{pkg.name}</h3>
              <p className="mt-2xs text-small text-charcoal/75">{pkg.tagline}</p>
              {pkg.priceFrom ? (
                <p className="mt-xs text-small text-taupe">From {pkg.priceFrom}</p>
              ) : null}
            </div>
          ))}
        </EditorialGrid>
      ) : (
        <Reveal className="mt-lg border border-dashed border-taupe/40 bg-white/50 px-lg py-xl text-center">
          <p className="text-small text-taupe">
            Full package details and pricing are coming soon.
          </p>
        </Reveal>
      )}

      <div className="mt-lg">
        <Button href={routes.packages} variant="text">
          View Packages
        </Button>
      </div>
    </Section>
  );
}
