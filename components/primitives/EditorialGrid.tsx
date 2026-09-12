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
export function EditorialGrid({
  children,
  gap = "md",
  className = "",
}: {
  children: ReactNode;
  gap?: "sm" | "md" | "lg";
  className?: string;
}) {
  const gapClass = { sm: "gap-sm", md: "gap-lg", lg: "gap-2xl" }[gap];
  return (
    <div className={`grid grid-cols-12 ${gapClass} ${className}`}>
      {children}
    </div>
  );
}
