import Link from "next/link";

import { Cluster } from "@/components/primitives/Cluster";
import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { footerAreaLinks } from "@/lib/navigation/routes";

export function ServiceAreaSection() {
  return (
    <Section tone="ivory" compact>
      <Reveal>
        <SectionHeading
          eyebrow="Service Area"
          title="Newborn Photography in Kathmandu Valley"
          description="Sessions are held primarily at the studio, with home sessions available where offered, for families across the valley."
        />
        <Cluster gap="md" className="mt-md">
          {footerAreaLinks.map((area) => (
            <Link
              key={area.href}
              href={area.href}
              className="text-small font-medium text-plum underline underline-offset-4 hover:text-charcoal"
            >
              {area.label}
            </Link>
          ))}
        </Cluster>
      </Reveal>
    </Section>
  );
}
