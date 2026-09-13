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

export type NavItem = {
  label: string;
  href: string;
};

/**
 * The five photography services, grouped under one "Services" header
 * dropdown rather than five flat top-level items — keeps the desktop nav
 * from overcrowding (see docs/DESIGN-SYSTEM.md, Header section).
 */
export const servicesNav: NavItem[] = [
  { label: "Newborn", href: routes.newborn },
  { label: "Maternity", href: routes.maternity },
  { label: "Baby", href: routes.baby },
  { label: "Cake Smash", href: routes.cakeSmash },
  { label: "Family", href: routes.family },
];

/** Flat top-level items, after the Services group, before the CTA. */
export const primaryNav: NavItem[] = [
  { label: "Portfolio", href: routes.portfolio },
  { label: "Packages", href: routes.packages },
  { label: "Studio", href: routes.studio },
  { label: "Training", href: routes.training },
  { label: "Blog", href: routes.blog },
];

export const contactLink: NavItem = {
  label: "Contact",
  href: routes.contact,
};

export const bookASessionCta: NavItem = {
  label: "Book a Session",
  href: routes.bookASession,
};

export const footerServiceLinks: NavItem[] = servicesNav;

export const footerStudioLinks: NavItem[] = [
  { label: "About", href: routes.about },
  { label: "Portfolio", href: routes.portfolio },
  { label: "Packages", href: routes.packages },
  { label: "Studio", href: routes.studio },
  { label: "Safety", href: routes.safety },
  { label: "Training", href: routes.training },
];

export const footerConnectLinks: NavItem[] = [
  { label: "Blog", href: routes.blog },
  { label: "FAQ", href: routes.faq },
  { label: "Contact", href: routes.contact },
  { label: "Book a Session", href: routes.bookASession },
];

export const footerAreaLinks: NavItem[] = [
  { label: "Kathmandu", href: routes.areasKathmandu },
  { label: "Lalitpur", href: routes.areasLalitpur },
  { label: "Bhaktapur", href: routes.areasBhaktapur },
];
