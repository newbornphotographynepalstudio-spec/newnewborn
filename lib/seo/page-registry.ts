import "server-only";

import type { Metadata } from "next";

import { routes } from "@/lib/navigation/routes";

/**
 * Every real, indexable static route in the app, paired with its own
 * page module's actual `generateMetadata` export — not a re-typed copy
 * of each page's defaults. Calling the same function Next.js calls to
 * render the real page is the only way this list can never drift from
 * what's actually served; a hand-maintained parallel list of titles/
 * descriptions would silently go stale the next time a page's copy
 * changes. Used by /admin/seo/effective/ to show the SEO actually being
 * served for every page in one place.
 */
/** What JSON-LD (if any) each page's own JSX actually renders — read
 * directly from each page.tsx, not inferred. Metadata (title/description/
 * OG/Twitter) is covered by `getMetadata` above; schema markup is a
 * separate `<script>` tag in the page body that no single function call
 * can introspect, so this is a manually-verified, one-line-per-page
 * summary instead. */
const NONE = "None";

export const PAGE_REGISTRY: { path: string; label: string; getMetadata: () => Promise<Metadata>; schema: string }[] = [
  { path: routes.home, label: "Homepage", getMetadata: () => import("@/app/(site)/page").then((m) => m.generateMetadata()), schema: "Organization, WebSite, ProfessionalService" },
  { path: routes.about, label: "About", getMetadata: () => import("@/app/(site)/about/page").then((m) => m.generateMetadata()), schema: NONE },
  { path: routes.newborn, label: "Newborn Photography", getMetadata: () => import("@/app/(site)/newborn-photography/page").then((m) => m.generateMetadata()), schema: NONE },
  { path: routes.maternity, label: "Maternity Photography", getMetadata: () => import("@/app/(site)/maternity-photography/page").then((m) => m.generateMetadata()), schema: NONE },
  { path: routes.baby, label: "Baby Photography", getMetadata: () => import("@/app/(site)/baby-photography/page").then((m) => m.generateMetadata()), schema: NONE },
  { path: routes.cakeSmash, label: "Cake Smash Photography", getMetadata: () => import("@/app/(site)/cake-smash-photography/page").then((m) => m.generateMetadata()), schema: NONE },
  { path: routes.family, label: "Family Photography", getMetadata: () => import("@/app/(site)/family-photography/page").then((m) => m.generateMetadata()), schema: NONE },
  { path: routes.portfolio, label: "Portfolio", getMetadata: () => import("@/app/(site)/portfolio/page").then((m) => m.generateMetadata()), schema: NONE },
  { path: routes.portfolioNewborn, label: "Portfolio — Newborn", getMetadata: () => import("@/app/(site)/portfolio/newborn/page").then((m) => m.generateMetadata()), schema: "BreadcrumbList" },
  { path: routes.portfolioMaternity, label: "Portfolio — Maternity", getMetadata: () => import("@/app/(site)/portfolio/maternity/page").then((m) => m.generateMetadata()), schema: NONE },
  { path: routes.portfolioBaby, label: "Portfolio — Baby", getMetadata: () => import("@/app/(site)/portfolio/baby/page").then((m) => m.generateMetadata()), schema: NONE },
  { path: routes.portfolioCakeSmash, label: "Portfolio — Cake Smash", getMetadata: () => import("@/app/(site)/portfolio/cake-smash/page").then((m) => m.generateMetadata()), schema: "BreadcrumbList" },
  { path: routes.portfolioFamily, label: "Portfolio — Family", getMetadata: () => import("@/app/(site)/portfolio/family/page").then((m) => m.generateMetadata()), schema: NONE },
  { path: routes.packages, label: "Packages", getMetadata: () => import("@/app/(site)/packages/page").then((m) => m.generateMetadata()), schema: NONE },
  { path: routes.studio, label: "Studio", getMetadata: () => import("@/app/(site)/studio/page").then((m) => m.generateMetadata()), schema: NONE },
  { path: routes.safety, label: "Safety", getMetadata: () => import("@/app/(site)/safety/page").then((m) => m.generateMetadata()), schema: NONE },
  { path: routes.blog, label: "Blog", getMetadata: () => import("@/app/(site)/blog/page").then((m) => m.generateMetadata()), schema: NONE },
  { path: routes.training, label: "Training", getMetadata: () => import("@/app/(site)/training/page").then((m) => m.generateMetadata()), schema: NONE },
  { path: routes.contact, label: "Contact", getMetadata: () => import("@/app/(site)/contact/page").then((m) => m.generateMetadata()), schema: NONE },
  { path: routes.bookASession, label: "Book a Session", getMetadata: () => import("@/app/(site)/book-a-session/page").then((m) => m.generateMetadata()), schema: NONE },
  { path: routes.faq, label: "FAQ", getMetadata: () => import("@/app/(site)/faq/page").then((m) => m.generateMetadata()), schema: "FAQPage" },
  { path: routes.areas, label: "Areas We Serve", getMetadata: () => import("@/app/(site)/areas/page").then((m) => m.generateMetadata()), schema: NONE },
  { path: routes.areasKathmandu, label: "Areas — Kathmandu", getMetadata: () => import("@/app/(site)/areas/kathmandu/page").then((m) => m.generateMetadata()), schema: NONE },
  { path: routes.areasLalitpur, label: "Areas — Lalitpur", getMetadata: () => import("@/app/(site)/areas/lalitpur/page").then((m) => m.generateMetadata()), schema: NONE },
  { path: routes.areasBhaktapur, label: "Areas — Bhaktapur", getMetadata: () => import("@/app/(site)/areas/bhaktapur/page").then((m) => m.generateMetadata()), schema: NONE },
];
