import type { ElementType, ReactNode } from "react";

import type { SpaceToken } from "@/components/primitives/Stack";

const gapClass: Record<SpaceToken, string> = {
  "3xs": "gap-1",
  "2xs": "gap-2",
  xs: "gap-3",
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
  xl: "gap-12",
  "2xl": "gap-16",
  "3xl": "gap-24",
};

const alignClass = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
} as const;

const justifyClass = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
} as const;

/** Horizontal, wrapping flex layout — button groups, tag lists, nav items. */
export function Cluster({
  children,
  gap = "sm",
  align = "center",
  justify = "start",
  wrap = true,
  as: Component = "div",
  className = "",
}: {
  children: ReactNode;
  gap?: SpaceToken;
  align?: keyof typeof alignClass;
  justify?: keyof typeof justifyClass;
  wrap?: boolean;
  as?: ElementType;
  className?: string;
}) {
  return (
    <Component
      className={`flex ${wrap ? "flex-wrap" : "flex-nowrap"} ${gapClass[gap]} ${alignClass[align]} ${justifyClass[justify]} ${className}`}
    >
      {children}
    </Component>
  );
}
