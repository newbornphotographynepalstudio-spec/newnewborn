import cultureHeritageSource from "@/public/photography/culture1.jpg";

/**
 * Client-supplied, pre-approved photography assets that live in the repo
 * (not Firebase Storage) because they're fixed brand/marketing assets, not
 * portfolio content. Each entry points at a static import of the file
 * copied into `public/` — see docs/DESIGN-SYSTEM.md, "culture1.jpg" for the
 * approval and usage rules; the original the client supplied stays
 * untouched at the project root.
 *
 * `cultureHeritageImage` is approved as the homepage's primary visual. It
 * is not wired into any page yet — the homepage build (a later phase) is
 * what actually places it, using `EditorialImage`'s `mobileAspect`/
 * `mobilePosition` art-direction props so mobile gets an intentional
 * portrait-biased crop instead of the desktop-wide one, without ever
 * cropping the source file itself. The position values below are a
 * starting point (the baby's face sits roughly a third of the way down
 * the frame, candlesticks and woven mats flank it left/right) — confirm
 * visually against the real rendered crop when the homepage is built.
 */
export const cultureHeritageImage = {
  src: cultureHeritageSource,
  alt: "A sleeping newborn dressed in traditional Nepali headwear and a red wrap, styled in a wooden bucket surrounded by brass vessels and hand-woven textiles.",
  recommendedAspect: "wide" as const,
  recommendedMobileAspect: "portrait" as const,
  recommendedPosition: "center" as const,
  recommendedMobilePosition: "top" as const,
};
