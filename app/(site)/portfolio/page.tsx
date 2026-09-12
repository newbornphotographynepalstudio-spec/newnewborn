import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "A look at newborn, maternity, baby, cake smash and family photography by Navin.",
};

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="Portfolio"
      title="Portfolio"
      description="A look at newborn, maternity, baby, cake smash and family photography by Navin."
    />
  );
}
