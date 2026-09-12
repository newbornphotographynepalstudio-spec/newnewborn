import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "Newborn Photography Training",
  description:
    "Training for photographers who want to learn safe, professional newborn photography, taught by Navin.",
};

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="Training"
      title="Newborn Photography Training"
      description="Training for photographers who want to learn safe, professional newborn photography, taught by Navin."
    />
  );
}
