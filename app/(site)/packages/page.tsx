import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "Packages",
  description:
    "Photography packages, premium albums, frames and prints from Newborn Photography Nepal.",
};

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="Packages & Pricing"
      title="Packages"
      description="Photography packages, premium albums, frames and prints from Newborn Photography Nepal."
    />
  );
}
