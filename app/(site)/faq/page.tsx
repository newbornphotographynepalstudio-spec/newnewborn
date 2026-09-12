import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about sessions with Newborn Photography Nepal.",
};

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="FAQ"
      title="Frequently Asked Questions"
      description="Answers to common questions about sessions with Newborn Photography Nepal."
    />
  );
}
