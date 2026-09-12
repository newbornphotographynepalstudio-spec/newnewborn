import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "Baby Portfolio",
  description:
    "Baby photography from Newborn Photography Nepal.",
};

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="Portfolio"
      title="Baby Portfolio"
      description="Baby photography from Newborn Photography Nepal."
    />
  );
}
