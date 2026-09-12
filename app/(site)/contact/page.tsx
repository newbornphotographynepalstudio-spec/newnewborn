import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Newborn Photography Nepal.",
};

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="Contact"
      title="Contact"
      description="Get in touch with Newborn Photography Nepal."
    />
  );
}
