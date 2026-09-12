import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "Sessions are held primarily at the Newborn Photography Nepal studio, with home sessions available where offered.",
};

export default function Page() {
  return (
    <PagePlaceholder
      eyebrow="The Studio"
      title="Studio"
      description="Sessions are held primarily at the Newborn Photography Nepal studio, with home sessions available where offered."
    />
  );
}
