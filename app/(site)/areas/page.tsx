import type { Metadata } from "next";

import { EditorialGrid } from "@/components/primitives/EditorialGrid";
import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { areas } from "@/lib/data/areas";
import { routes } from "@/lib/navigation/routes";
import { buildPageMetadata } from "@/lib/seo/build-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata(routes.areas, {
    title: "Areas We Serve",
    description:
      "Newborn Photography Nepal serves families across Kathmandu Valley, Nepal, including Kathmandu, Lalitpur and Bhaktapur.",
  });
}

export default function AreasPage() {
  return (
    <>
      <PageHero
        eyebrow="Service Area"
        title="Newborn Photography in Kathmandu Valley"
        description="Sessions are held primarily at the studio, with home sessions available where offered, for families across the valley."
      />

      <Section>
        <EditorialGrid gap="lg">
          {Object.values(areas).map((area) => (
            <div key={area.slug} className="col-span-12 sm:col-span-4">
              <h2 className="text-h3 text-plum">{area.name}</h2>
              <p className="mt-2 text-body text-charcoal/75">{area.intro[0]}</p>
              <Button href={area.href} variant="text" className="mt-4">
                {area.name} Photography
              </Button>
            </div>
          ))}
        </EditorialGrid>
      </Section>
    </>
  );
}
