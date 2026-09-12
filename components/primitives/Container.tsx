import type { ElementType, ReactNode } from "react";

type ContainerSize = "prose" | "default" | "wide" | "full";

const maxWidthClass: Record<ContainerSize, string> = {
  prose: "max-w-prose",
  default: "max-w-7xl",
  wide: "max-w-wide",
  full: "max-w-none",
};

/**
 * The standard horizontal-rhythm wrapper. Padding uses the fluid
 * `--space-gutter` token so mobile keeps a safe inset and large screens get
 * real breathing room, without a breakpoint table to maintain.
 *
 * Photography is allowed to break out of this — see FullBleed.
 */
export function Container({
  children,
  size = "default",
  as: Component = "div",
  className = "",
}: {
  children: ReactNode;
  size?: ContainerSize;
  as?: ElementType;
  className?: string;
}) {
  return (
    <Component
      className={`mx-auto w-full px-gutter ${maxWidthClass[size]} ${className}`}
    >
      {children}
    </Component>
  );
}
