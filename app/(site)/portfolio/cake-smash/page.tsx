import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "Cake Smash Portfolio",
  description:
    "Cake smash photography from Newborn Photography Nepal.",
};

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="Portfolio"
      title="Cake Smash Portfolio"
      description="Cake smash photography from Newborn Photography Nepal."
    />
  );
}
