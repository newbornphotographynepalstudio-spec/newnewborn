import type { ElementType, ReactNode } from "react";

import type { SpaceToken } from "@/components/primitives/Stack";

const gapClass: Record<SpaceToken, string> = {
  "3xs": "gap-3xs",
  "2xs": "gap-2xs",
  xs: "gap-xs",
  sm: "gap-sm",
  md: "gap-md",
  lg: "gap-lg",
  xl: "gap-xl",
  "2xl": "gap-2xl",
  "3xl": "gap-3xl",
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
