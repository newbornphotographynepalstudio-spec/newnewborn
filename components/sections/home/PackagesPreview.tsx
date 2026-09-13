import { EditorialGrid } from "@/components/primitives/EditorialGrid";
import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { newbornPackages } from "@/lib/data/packages";
import { routes } from "@/lib/navigation/routes";

/** Real newborn session pricing (NPR), exactly as provided — no invented
 * figures. Other services still show "pricing on request" on /packages/
 * until their own packages are published. */
export function PackagesPreview() {
  return (
    <Section tone="ivory">
      <SectionHeading
        eyebrow="Packages"
        title="Newborn session packages"
        description="Three ways to book a newborn session, from a short essential sitting to the full luxury experience."
      />

      <EditorialGrid className="mt-16">
        {newbornPackages.map((pkg) => (
          <div
            key={pkg.id}
            className={`col-span-12 border-t pt-6 sm:col-span-4 ${
              pkg.featured ? "border-plum" : "border-taupe/20"
            }`}
          >
            {pkg.featured ? (
              <p className="text-caption font-medium tracking-eyebrow text-plum uppercase">
                Most Chosen
              </p>
            ) : null}
            <h3 className="mt-2 text-h4 text-plum">{pkg.name}</h3>
            <p className="mt-2 text-h3">{pkg.priceLabel}</p>
            <p className="mt-2 text-small text-charcoal/75">{pkg.tagline}</p>
          </div>
        ))}
      </EditorialGrid>

      <div className="mt-10">
        <Button href={routes.packages} variant="text">
          Compare Packages
        </Button>
      </div>
    </Section>
  );
}
