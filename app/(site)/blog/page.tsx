import type { Metadata } from "next";

import { Section } from "@/components/primitives/Section";
import { PageHero } from "@/components/ui/PageHero";
import { routes } from "@/lib/navigation/routes";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles on newborn safety, session preparation and photography from Newborn Photography Nepal.",
  alternates: { canonical: routes.blog },
};

const upcomingTopics = [
  "How to prepare for a newborn session",
  "What to bring to a maternity session",
  "Choosing outfits for a family session",
  "When to book a cake smash session",
];

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Articles are on their way"
        description="This is where session-prep guides and photography notes will be published. Nothing is live yet, here's what's planned first."
      />

      <Section>
        <ul className="mx-auto max-w-md space-y-3 border-t border-taupe/20 pt-6">
          {upcomingTopics.map((topic) => (
            <li key={topic} className="border-b border-taupe/20 pb-3 text-body text-charcoal/80">
              {topic}
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
