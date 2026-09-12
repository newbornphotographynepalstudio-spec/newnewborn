import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "Maternity Photography",
  description:
    "Maternity photography sessions by Navin, based in Kathmandu Valley, Nepal.",
};

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="Maternity Photography"
      title="Maternity Photography"
      description="Maternity photography sessions by Navin, based in Kathmandu Valley, Nepal."
    />
  );
}
