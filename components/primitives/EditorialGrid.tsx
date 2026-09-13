import type { ReactNode } from "react";

/**
 * A 12-column grid for asymmetric, art-directed compositions — the
 * alternative to a uniform [card][card][card] row. Children position
 * themselves with Tailwind's `col-span-*` / `col-start-*` utilities
 * directly (kept deliberately unopinionated rather than adding a preset
 * for every possible arrangement).
 *
 * Example:
 *   <EditorialGrid>
 *     <div className="col-span-12 lg:col-span-7">...</div>
 *     <div className="col-span-12 lg:col-span-4 lg:col-start-9">...</div>
 *   </EditorialGrid>
 */

/**
 * Column gap is deliberately responsive, not a flat value: this grid is
 * always 12 tracks even when every child is `col-span-12` (i.e. no visual
 * columns yet, below `sm`/`lg`) — and a 12-track grid still reserves 11
 * fixed-width gaps regardless of how items span. At a 320px viewport a
 * flat `gap-8` (32px) reserves 11 × 32px = 352px, which alone exceeds the
 * ~275px content width and forces the grid wider than its container even
 * though `minmax(0,1fr)` tracks can shrink to 0. So the column gap starts
 * small (real columns don't exist yet at that width) and only grows to
 * its full design value once `sm:`/`lg:` breakpoints actually introduce
 * multi-column spans. Row gap stays constant since vertical stacking
 * spacing isn't affected by this.
 */
const gapClasses = {
  sm: "gap-y-4 gap-x-2 sm:gap-x-2 lg:gap-x-4",
  md: "gap-y-8 gap-x-2 sm:gap-x-4 lg:gap-x-8",
  lg: "gap-y-16 gap-x-2 sm:gap-x-6 lg:gap-x-16",
} as const;

export function EditorialGrid({
  children,
  gap = "md",
  className = "",
}: {
  children: ReactNode;
  gap?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-12 ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
}
