import type { ElementType, ReactNode } from "react";

import { Container } from "@/components/primitives/Container";

type SectionTone = "ivory" | "blush" | "plum" | "none";

const toneClass: Record<SectionTone, string> = {
  ivory: "bg-ivory text-charcoal",
  blush: "bg-blush text-charcoal",
  plum: "bg-plum text-white",
  none: "",
};

/**
 * The standard vertical-rhythm wrapper for a page section. Uses the fluid
 * `--spacing-section-y` token so sections stay generously spaced on desktop
 * without ever feeling cramped on mobile — never override this locally to
 * "fit more above the fold."
 */
export function Section({
  children,
  tone = "none",
  compact = false,
  containerSize = "default",
  as: Component = "section",
  className = "",
}: {
  children: ReactNode;
  tone?: SectionTone;
  /** Use the smaller `--spacing-section-y-sm` rhythm for a lighter section. */
  compact?: boolean;
  containerSize?: "prose" | "default" | "wide" | "full";
  as?: ElementType;
  className?: string;
}) {
  return (
    <Component
      className={`${compact ? "py-section-y-sm" : "py-section-y"} ${toneClass[tone]} ${className}`}
    >
      <Container size={containerSize}>{children}</Container>
    </Component>
  );
}
