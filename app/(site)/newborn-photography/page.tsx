import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "Newborn Photography",
  description:
    "Newborn photography sessions by Navin, based in Kathmandu Valley, Nepal.",
};

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="Newborn Photography"
      title="Newborn Photography"
      description="Newborn photography sessions by Navin, based in Kathmandu Valley, Nepal."
    />
  );
}
