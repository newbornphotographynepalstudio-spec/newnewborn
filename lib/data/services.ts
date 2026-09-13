import type { ImageProps } from "next/image";

import { routes } from "@/lib/navigation/routes";

/**
 * The five real, already-established service categories for this
 * business. Descriptions are factual summaries of the known service
 * scope, not invented claims. `image` is only set for services with an
 * approved photography asset dedicated to that category — components
 * must render an honest placeholder (never invented photography) when
 * it's absent. The one approved photo (culture1.jpg) is used as the
 * homepage hero and in Featured Work, not repeated here too — the
 * newborn tile gets its visual emphasis from layout size instead, to
 * avoid showing the same photograph twice in one scroll.
 */
export type ServiceSummary = {
  slug: string;
  name: string;
  href: string;
  description: string;
  image?: ImageProps["src"];
  imageAlt?: string;
  featured?: boolean;
};

export function getServices(): ServiceSummary[] {
  return [
    {
      slug: "newborn",
      name: "Newborn",
      href: routes.newborn,
      description:
        "Gentle, safety-led portraits of your baby's earliest days, styled with quiet care in the studio.",
      featured: true,
    },
    {
      slug: "maternity",
      name: "Maternity",
      href: routes.maternity,
      description: "Portraits that honor the final weeks of pregnancy, before your baby arrives.",
    },
    {
      slug: "baby",
      name: "Baby",
      href: routes.baby,
      description: "Milestone sessions that follow your baby's first months of growth and personality.",
    },
    {
      slug: "cake-smash",
      name: "Cake Smash",
      href: routes.cakeSmash,
      description: "A joyful, playful session to mark your baby's first birthday.",
    },
    {
      slug: "family",
      name: "Family",
      href: routes.family,
      description: "Portraits that bring the whole family together in one set of images.",
    },
  ];
}
