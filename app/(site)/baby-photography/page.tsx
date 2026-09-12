import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "Baby Photography",
  description:
    "Baby photography sessions by Navin, based in Kathmandu Valley, Nepal.",
};

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="Baby Photography"
      title="Baby Photography"
      description="Baby photography sessions by Navin, based in Kathmandu Valley, Nepal."
    />
  );
}
