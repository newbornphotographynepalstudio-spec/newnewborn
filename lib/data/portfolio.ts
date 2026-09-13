import { routes } from "@/lib/navigation/routes";

export type PortfolioCategory = {
  slug: "newborn" | "maternity" | "baby" | "cake-smash" | "family";
  name: string;
  href: string;
  serviceHref: string;
};

export const portfolioCategories: PortfolioCategory[] = [
  { slug: "newborn", name: "Newborn", href: routes.portfolioNewborn, serviceHref: routes.newborn },
  { slug: "maternity", name: "Maternity", href: routes.portfolioMaternity, serviceHref: routes.maternity },
  { slug: "baby", name: "Baby", href: routes.portfolioBaby, serviceHref: routes.baby },
  {
    slug: "cake-smash",
    name: "Cake Smash",
    href: routes.portfolioCakeSmash,
    serviceHref: routes.cakeSmash,
  },
  { slug: "family", name: "Family", href: routes.portfolioFamily, serviceHref: routes.family },
];
