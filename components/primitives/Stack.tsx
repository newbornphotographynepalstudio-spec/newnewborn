import type { ElementType, ReactNode } from "react";

export type SpaceToken =
  | "3xs"
  | "2xs"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl";

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

/** Vertical flex layout with a consistent gap from the spacing scale. */
export function Stack({
  children,
  gap = "md",
  align,
  as: Component = "div",
  className = "",
}: {
  children: ReactNode;
  gap?: SpaceToken;
  align?: "start" | "center" | "end" | "stretch";
  as?: ElementType;
  className?: string;
}) {
  return (
    <Component
      className={`flex flex-col ${gapClass[gap]} ${align ? alignClass[align] : ""} ${className}`}
    >
      {children}
    </Component>
  );
}
