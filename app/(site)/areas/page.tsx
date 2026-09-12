import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "Areas We Serve",
  description:
    "Newborn Photography Nepal serves families across Kathmandu Valley, Nepal, including Kathmandu, Lalitpur and Bhaktapur.",
};

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="Areas Served"
      title="Areas We Serve"
      description="Newborn Photography Nepal serves families across Kathmandu Valley, Nepal, including Kathmandu, Lalitpur and Bhaktapur."
    />
  );
}
