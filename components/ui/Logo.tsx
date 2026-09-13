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
 *
 * `sizes="48px"` matters here even though it looks pointless on a 2048×2048
 * source: without it, next/image has no hint that this always renders
 * tiny (max h-12/48px) and falls back to picking from its large
 * `deviceSizes` bucket — measured serving a 2048px-wide, ~378KB derivative
 * for a 48px logo before this was added. With it, the browser correctly
 * requests from the small `imageSizes` bucket instead.
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
        sizes="48px"
        className={`w-auto ${heightClass}`}
      />
    </Link>
  );
}
