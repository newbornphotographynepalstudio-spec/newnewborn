import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "Newborn & Family Photography in Kathmandu",
  description:
    "Newborn, maternity, baby, cake smash and family photography for families in Kathmandu.",
};

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="Areas Served"
      title="Newborn & Family Photography in Kathmandu"
      description="Newborn, maternity, baby, cake smash and family photography for families in Kathmandu."
    />
  );
}
