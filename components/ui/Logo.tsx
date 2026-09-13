import Image from "next/image";
import Link from "next/link";

import logo from "@/public/brand/logo.jpg";

/**
 * Renders the supplied brand mark as-is (fixed aspect ratio, never
 * stretched, recolored or filtered). The source file currently has a solid
 * blush background baked in rather than transparency — swap in a
 * transparent PNG/SVG version here once one is supplied, no other change
 * needed elsewhere.
 *
 * `size` controls responsive height: "compact" for tight spaces (e.g. a
 * scrolled-state header), "default" for the standard header height.
 *
 * `priority` should be true only for the header's instance (above the
 * fold on every page). Leave it false anywhere else (e.g. the footer) so
 * Next.js doesn't preload/eager-load an image nowhere near the LCP.
 */
export function Logo({
  className = "",
  size = "default",
  priority = false,
}: {
  className?: string;
  size?: "compact" | "default";
  priority?: boolean;
}) {
  const heightClass =
    size === "compact" ? "h-8 sm:h-9" : "h-9 sm:h-11 lg:h-12";

  return (
    <Link
      href="/"
      aria-label="Newborn Photography Nepal — home"
      className={`inline-block shrink-0 ${className}`}
    >
      <Image
        src={logo}
        alt="Newborn Photography Nepal by Navin"
        priority={priority}
        className={`w-auto ${heightClass}`}
      />
    </Link>
  );
}
