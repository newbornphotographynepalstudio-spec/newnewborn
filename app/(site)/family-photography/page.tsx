import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "Family Photography",
  description:
    "Family photography sessions by Navin, based in Kathmandu Valley, Nepal.",
};

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="Family Photography"
      title="Family Photography"
      description="Family photography sessions by Navin, based in Kathmandu Valley, Nepal."
    />
  );
}
