import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "Newborn Portfolio",
  description:
    "Newborn photography from Newborn Photography Nepal.",
};

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="Portfolio"
      title="Newborn Portfolio"
      description="Newborn photography from Newborn Photography Nepal."
    />
  );
}
