import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "About Newborn Photography Nepal",
  description:
    "Newborn Photography Nepal is a photography studio led by Navin, offering newborn, maternity, baby, cake smash and family photography in Kathmandu Valley, Nepal.",
};

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="About"
      title="About Newborn Photography Nepal"
      description="Newborn Photography Nepal is a photography studio led by Navin, offering newborn, maternity, baby, cake smash and family photography in Kathmandu Valley, Nepal."
    />
  );
}
