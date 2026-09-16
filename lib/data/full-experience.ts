import { routes } from "@/lib/navigation/routes";

/**
 * The complete before/during/after session journey for the
 * `/experience/` page — every stage restates a real fact already
 * established elsewhere in this codebase (Safety page's principles,
 * Studio page's features, the FAQ set, service-page FAQs, packages'
 * inclusions) rather than inventing new claims about this studio's exact
 * process. The one genuine gap — an exact photo-delivery turnaround
 * time — has no source anywhere in this codebase, so `delivery.description`
 * below deliberately says timelines vary by package rather than stating
 * a specific number (OWNER CONTENT REQUIRED to make this more specific).
 */
export type ExperienceStage = {
  id: string;
  number: string;
  title: string;
  description: string;
};

/**
 * "What to bring," per service — answers a real, common AEO question
 * (SEO Phase 2) using only facts already established on each service's
 * own page (lib/data/service-pages.ts `includes`/`faqs`), restated here
 * as a direct checklist rather than left buried in prose. Nothing here
 * is a new claim: newborn/baby restate that wraps/styling are provided;
 * maternity/family restate the existing "styling guidance beforehand"
 * fact; cake smash restates the existing cake/outfit FAQ answers.
 *
 * `href` (SEO Phase 4) links each service name to its own service page —
 * internal-linking only, the checklist information itself is unchanged.
 */
export type WhatToBringItem = {
  service: string;
  href: string;
  detail: string;
};

export const whatToBring: WhatToBringItem[] = [
  {
    service: "Newborn",
    href: routes.newborn,
    detail: "Nothing extra needed — wraps, hats and set-ups are provided at the studio.",
  },
  {
    service: "Baby",
    href: routes.baby,
    detail: "Nothing extra needed — styling is simple and seasonally-appropriate, provided at the studio.",
  },
  {
    service: "Maternity",
    href: routes.maternity,
    detail: "Your own outfit, chosen with the styling guidance shared before your session.",
  },
  {
    service: "Family",
    href: routes.family,
    detail: "Coordinated outfits for your group, with guidance shared beforehand.",
  },
  {
    service: "Cake Smash",
    href: routes.cakeSmash,
    detail: "A small, simple cake, and an outfit change afterward if you'd like one.",
  },
];

export const fullExperience: ExperienceStage[] = [
  {
    id: "planning",
    number: "01",
    title: "Planning",
    description:
      "Before your session, there's a conversation to talk through timing, styling and anything on your mind — so nothing about the day itself is a surprise.",
  },
  {
    id: "preparing",
    number: "02",
    title: "Preparing for Your Session",
    description:
      "You don't need to arrive with everything figured out. Wraps, hats and simple set-ups are provided at the studio, and styling guidance is shared beforehand for maternity and family sessions.",
  },
  {
    id: "arrival",
    number: "03",
    title: "Arrival at the Studio",
    description:
      "Sessions are one family at a time, with no waiting room and no other clients coming or going. The room is kept warm ahead of newborn sessions specifically, since a comfortable temperature makes a real difference to how settled a baby is.",
  },
  {
    id: "baby-preparation",
    number: "04",
    title: "Getting Your Baby Ready",
    description:
      "Feeding and soothing happen on your baby's schedule, not a fixed one. There's time built in before posing starts for your baby to settle in the space.",
  },
  {
    id: "session",
    number: "05",
    title: "The Photography Session",
    description:
      "An unhurried, baby-led session: no pose is forced, every pose is supported by hand throughout, and lighting is set up and adjusted through the session rather than relying on whatever light happens to be available.",
  },
  {
    id: "participation",
    number: "06",
    title: "Parents and Family",
    description:
      "You're in the room for the entire session, able to step in, ask for a break, or simply watch from close by. Many families also include a few portraits with parents, siblings or grandparents alongside the individual images.",
  },
  {
    id: "unsettled",
    number: "07",
    title: "If Your Baby Is Unsettled",
    description:
      "It's expected, and the session is planned around it. If a baby is unsettled in a position, the session moves to something calmer rather than pushing through it — feeding and soothing breaks have no fixed schedule to rush through.",
  },
  {
    id: "review",
    number: "08",
    title: "Choosing Your Images",
    description:
      "Afterward, you'll get a curated gallery of your favorite portraits to view and choose from — a private viewing, not a rushed decision made at the studio.",
  },
  {
    id: "delivery",
    number: "09",
    title: "Receiving Your Photos",
    description:
      "Your chosen package sets how many edited photos (and, for some packages, RAW files or cinematic reels) you receive. Exact turnaround timing is confirmed when you book, since it varies by package and season.",
  },
  {
    id: "after-delivery",
    number: "10",
    title: "After Delivery",
    description:
      "Premium albums, frames and prints are available to turn your favorite images into lasting keepsakes — from a standard frame to a full Karizma photo book, depending on your package.",
  },
];
