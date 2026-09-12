import Image from "next/image";
import Link from "next/link";

import logo from "@/public/brand/logo.jpg";

/**
 * Renders the supplied brand mark as-is (fixed aspect ratio, never
 * stretched or recolored). The source file currently has a solid blush
 * background baked in rather than transparency — swap in a transparent
 * PNG/SVG version here once one is supplied, no other change required.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="Newborn Photography Nepal — home" className={className}>
      <Image
        src={logo}
        alt="Newborn Photography Nepal by Navin"
        priority
        className="h-12 w-auto"
      />
    </Link>
  );
}
