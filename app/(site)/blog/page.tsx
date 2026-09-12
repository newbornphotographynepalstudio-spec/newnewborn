import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles from Newborn Photography Nepal.",
};

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="Blog"
      title="Blog"
      description="Articles from Newborn Photography Nepal."
    />
  );
}
