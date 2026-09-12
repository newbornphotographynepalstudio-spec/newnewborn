import type { ReactNode } from "react";

/**
 * Breaks its children out of a centered container to the full viewport
 * width — for editorial full-bleed photography. Use from within a Section
 * (which itself stays constrained by Container); FullBleed escapes that
 * constraint for its own content only.
 */
export function FullBleed({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`full-bleed ${className}`}>{children}</div>;
}
