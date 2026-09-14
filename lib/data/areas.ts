import { routes } from "@/lib/navigation/routes";

export type AreaSlug = "kathmandu" | "lalitpur" | "bhaktapur";

export type AreaContent = {
  slug: AreaSlug;
  name: string;
  href: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string[];
};

export const areas: Record<AreaSlug, AreaContent> = {
  kathmandu: {
    slug: "kathmandu",
    name: "Kathmandu",
    href: routes.areasKathmandu,
    metaTitle: "Newborn Photography in Kathmandu",
    metaDescription:
      "Newborn, maternity, baby and family photography for families in Kathmandu: studio sessions with home sessions available where offered.",
    h1: "Newborn Photography in Kathmandu",
    intro: [
      "Families across Kathmandu book newborn, maternity, baby, cake smash and family sessions at the studio, based in Kathmandu Valley.",
      "Sessions are primarily studio-based, with home sessions available where offered. Reach out to check what's possible for your address and timing.",
    ],
  },
  lalitpur: {
    slug: "lalitpur",
    name: "Lalitpur",
    href: routes.areasLalitpur,
    metaTitle: "Newborn Photography in Lalitpur",
    metaDescription:
      "Newborn, maternity, baby and family photography for families in Lalitpur (Patan): studio sessions with home sessions available where offered.",
    h1: "Newborn Photography in Lalitpur",
    intro: [
      "Families from Lalitpur (Patan) and the surrounding area travel to the studio in Kathmandu Valley for newborn, maternity, baby, cake smash and family sessions.",
      "If a home session is a better fit for your family, let us know when you get in touch. It may be possible depending on timing and location.",
    ],
  },
  bhaktapur: {
    slug: "bhaktapur",
    name: "Bhaktapur",
    href: routes.areasBhaktapur,
    metaTitle: "Newborn Photography in Bhaktapur",
    metaDescription:
      "Newborn, maternity, baby and family photography for families in Bhaktapur: studio sessions with home sessions available where offered.",
    h1: "Newborn Photography in Bhaktapur",
    intro: [
      "Families from Bhaktapur are welcome at the studio in Kathmandu Valley for newborn, maternity, baby, cake smash and family sessions.",
      "Newborn sessions are timed around your baby's first two weeks, so it's worth reaching out early in your pregnancy to plan the date.",
    ],
  },
};
