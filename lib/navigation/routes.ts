/**
 * Single source of truth for the public route map.
 * Used by navigation, the sitemap, and redirect configuration so the three
 * never drift out of sync.
 */

export const routes = {
  home: "/",
  about: "/about/",
  newborn: "/newborn-photography/",
  maternity: "/maternity-photography/",
  baby: "/baby-photography/",
  cakeSmash: "/cake-smash-photography/",
  family: "/family-photography/",
  portfolio: "/portfolio/",
  portfolioNewborn: "/portfolio/newborn/",
  portfolioMaternity: "/portfolio/maternity/",
  portfolioBaby: "/portfolio/baby/",
  portfolioCakeSmash: "/portfolio/cake-smash/",
  portfolioFamily: "/portfolio/family/",
  packages: "/packages/",
  studio: "/studio/",
  safety: "/safety/",
  blog: "/blog/",
  training: "/training/",
  contact: "/contact/",
  bookASession: "/book-a-session/",
  faq: "/faq/",
  areas: "/areas/",
  areasKathmandu: "/areas/kathmandu/",
  areasLalitpur: "/areas/lalitpur/",
  areasBhaktapur: "/areas/bhaktapur/",
} as const;

export type PrimaryNavItem = {
  label: string;
  href: string;
};

/** Order matches the desktop navigation defined in the architecture spec. */
export const primaryNav: PrimaryNavItem[] = [
  { label: "Home", href: routes.home },
  { label: "About", href: routes.about },
  { label: "Newborn", href: routes.newborn },
  { label: "Maternity", href: routes.maternity },
  { label: "Baby", href: routes.baby },
  { label: "Cake Smash", href: routes.cakeSmash },
  { label: "Family", href: routes.family },
  { label: "Portfolio", href: routes.portfolio },
  { label: "Packages", href: routes.packages },
  { label: "Studio", href: routes.studio },
  { label: "Training", href: routes.training },
  { label: "Blog", href: routes.blog },
  { label: "Contact", href: routes.contact },
];

export const bookASessionCta: PrimaryNavItem = {
  label: "Book a Session",
  href: routes.bookASession,
};

export const footerServiceLinks: PrimaryNavItem[] = [
  { label: "Newborn Photography", href: routes.newborn },
  { label: "Maternity Photography", href: routes.maternity },
  { label: "Baby Photography", href: routes.baby },
  { label: "Cake Smash Photography", href: routes.cakeSmash },
  { label: "Family Photography", href: routes.family },
  { label: "Photography Training", href: routes.training },
];

export const footerStudioLinks: PrimaryNavItem[] = [
  { label: "About", href: routes.about },
  { label: "Studio", href: routes.studio },
  { label: "Safety", href: routes.safety },
  { label: "Packages", href: routes.packages },
  { label: "Portfolio", href: routes.portfolio },
  { label: "FAQ", href: routes.faq },
];

export const footerAreaLinks: PrimaryNavItem[] = [
  { label: "Kathmandu", href: routes.areasKathmandu },
  { label: "Lalitpur", href: routes.areasLalitpur },
  { label: "Bhaktapur", href: routes.areasBhaktapur },
];
