import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "Newborn Safety",
  description:
    "Newborn safety is central to how every session at Newborn Photography Nepal is planned and run.",
};

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="Safety"
      title="Newborn Safety"
      description="Newborn safety is central to how every session at Newborn Photography Nepal is planned and run."
    />
  );
}
