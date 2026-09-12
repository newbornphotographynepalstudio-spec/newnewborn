import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "Book a Session",
  description:
    "Enquire about booking a newborn, maternity, baby, cake smash or family photography session.",
};

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="Book a Session"
      title="Book a Session"
      description="Enquire about booking a newborn, maternity, baby, cake smash or family photography session."
    />
  );
}
