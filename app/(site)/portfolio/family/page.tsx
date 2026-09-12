import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "Family Portfolio",
  description:
    "Family photography from Newborn Photography Nepal.",
};

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="Portfolio"
      title="Family Portfolio"
      description="Family photography from Newborn Photography Nepal."
    />
  );
}
