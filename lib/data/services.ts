import type { ImageProps } from "next/image";

import { cakeSmashGallery } from "@/lib/media/cake-smash-gallery";
import { newbornGallery } from "@/lib/media/newborn-gallery";
import { routes } from "@/lib/navigation/routes";

/**
 * The five real, already-established service categories for this
 * business. Descriptions are factual summaries of the known service
 * scope, not invented claims. `image` is only set for services with an
 * approved photography asset dedicated to that category — components
 * must render an honest placeholder (never invented photography) when
 * it's absent. Newborn and Cake Smash use photos not already shown
 * elsewhere on the homepage (see FeaturedWork/HeritageSection); Maternity/
 * Baby/Family have no approved static photography yet, so their `image`
 * stays unset here — ServicesOverview additionally checks the Media
 * Library at render time for those three before falling back to an
 * honest "gallery being curated" state.
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

const newbornCardPhoto = newbornGallery.find((img) => img.id === "newborn-robe-chair")!;
const cakeSmashCardPhoto = cakeSmashGallery.find((img) => img.id === "cakesmash-balloon-portrait")!;

export function getServices(): ServiceSummary[] {
  return [
    {
      slug: "newborn",
      name: "Newborn",
      href: routes.newborn,
      description:
        "Gentle, safety-led portraits of your baby's earliest days, styled with quiet care in the studio.",
      image: newbornCardPhoto.src,
      imageAlt: newbornCardPhoto.alt,
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
      image: cakeSmashCardPhoto.src,
      imageAlt: cakeSmashCardPhoto.alt,
    },
    {
      slug: "family",
      name: "Family",
      href: routes.family,
      description: "Portraits that bring the whole family together in one set of images.",
    },
  ];
}
