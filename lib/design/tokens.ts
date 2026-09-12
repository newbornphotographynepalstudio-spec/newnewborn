/**
 * The small subset of design tokens needed in JS/TS (not just CSS).
 * Colors, type scale, spacing, radii and shadows live in app/globals.css as
 * CSS custom properties / Tailwind v4 @theme — use the generated Tailwind
 * utilities (bg-plum, text-ivory, gap-md, etc.) for those. This file only
 * covers values a component needs to read in JavaScript.
 */

/** Matches the CSS custom properties of the same name in globals.css. */
export const motion = {
  duration: {
    fast: 150,
    base: 250,
    slow: 500,
  },
  easePremium: "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

/** Matches Tailwind v4's default breakpoint scale — documented here so
 * components that need a breakpoint in JS (e.g. a resize-based check)
 * don't invent a different number than the CSS uses. */
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

/** Returns true if the visitor has requested reduced motion, or false in
 * environments without matchMedia (SSR). Always check this before starting
 * a JS-driven animation (e.g. in Reveal). */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
