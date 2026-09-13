import { routes } from "@/lib/navigation/routes";

/**
 * Real, client-provided newborn session packages and pricing (NPR).
 * These are exact figures — never altered, no invented inclusions, no
 * discounts, no fabricated availability. Currently newborn-specific;
 * other services don't have published packages yet, so their pages keep
 * the "pricing on request" treatment.
 */
export type PackageSummary = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  priceLabel: string;
  duration: string;
  setups: string;
  editedPhotos: string;
  includes: string[];
  href: string;
  featured?: boolean;
};

export const newbornPackages: PackageSummary[] = [
  {
    id: "mini-newborn",
    name: "Mini Newborn Session",
    tagline: "Quick and sweet. Perfect for a few essential setups.",
    price: 7999,
    priceLabel: "NPR 7,999",
    duration: "1 hour",
    setups: "1 pose / setup",
    editedPhotos: "5 edited photos",
    includes: [
      "1 hour photography session",
      "1 pose / setup",
      "5 edited photos",
      "Limited outfit, props and wraps choices",
      "Family portraits included",
    ],
    href: routes.bookASession,
  },
  {
    id: "premium-newborn",
    name: "Premium Newborn Session",
    tagline: "The absolute favorite. Unrushed, aesthetic, and includes cinematic reels.",
    price: 15999,
    priceLabel: "NPR 15,999",
    duration: "2 hours, unrushed",
    setups: "4 poses / setups",
    editedPhotos: "12 edited photos + 100 RAW photos",
    includes: [
      "2 hour unrushed session",
      "4 poses / setups",
      "12 edited photos",
      "100 RAW photos",
      "Select from all outfits (40+ choices)",
      "2 cinematic reels videos",
      "Standard frame",
    ],
    href: routes.bookASession,
    featured: true,
  },
  {
    id: "luxury",
    name: "Luxury Package",
    tagline: "The ultimate premium package for all the core memories, with premium printed albums.",
    price: 31999,
    priceLabel: "NPR 31,999",
    duration: "3–4 hours, unrushed",
    setups: "8 poses / setups",
    editedPhotos: "24 edited photos + all RAW photos",
    includes: [
      "3–4 hour luxury unrushed session",
      "8 poses / setups",
      "24 edited photos",
      "All RAW photos",
      "Premium outfits",
      "5 cinematic reels",
      "Premium big frame",
      "Karizma photo book",
    ],
    href: routes.bookASession,
  },
];
