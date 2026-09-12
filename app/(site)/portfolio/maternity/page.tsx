import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "Maternity Portfolio",
  description:
    "Maternity photography from Newborn Photography Nepal.",
};

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="Portfolio"
      title="Maternity Portfolio"
      description="Maternity photography from Newborn Photography Nepal."
    />
  );
}
