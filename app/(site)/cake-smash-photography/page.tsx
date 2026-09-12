import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "Cake Smash Photography",
  description:
    "Cake smash photography sessions for baby milestones, by Navin in Kathmandu Valley, Nepal.",
};

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="Cake Smash Photography"
      title="Cake Smash Photography"
      description="Cake smash photography sessions for baby milestones, by Navin in Kathmandu Valley, Nepal."
    />
  );
}
