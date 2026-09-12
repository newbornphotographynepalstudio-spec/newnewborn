import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";

type Variant = "primary" | "secondary" | "text";
type Size = "md" | "sm";

const base =
  "group inline-flex items-center justify-center gap-2xs font-sans font-medium tracking-wide transition-colors duration-base ease-premium focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50";

const variantClass: Record<Variant, string> = {
  primary: "rounded-sm bg-plum px-lg text-white hover:bg-(--color-accent-hover)",
  secondary:
    "rounded-sm border border-taupe/40 bg-transparent px-lg text-plum hover:border-plum hover:bg-(--color-accent-soft)",
  text: "bg-transparent px-0 text-plum underline-offset-4 hover:underline",
};

const sizeClass: Record<Variant, Record<Size, string>> = {
  primary: { md: "py-sm text-small", sm: "py-2xs text-caption" },
  secondary: { md: "py-sm text-small", sm: "py-2xs text-caption" },
  text: { md: "text-small", sm: "text-caption" },
};

/** A small right-pointing arrow, used on text-variant links to indicate direction. */
function DirectionalIndicator() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
      className="shrink-0 transition-transform duration-base ease-premium group-hover:translate-x-0.5"
    >
      <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type BaseProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  "aria-label"?: string;
};

type LinkButtonProps = BaseProps & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  type?: undefined;
  disabled?: undefined;
};

type NativeButtonProps = BaseProps & {
  href?: undefined;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

/**
 * The site's only button/CTA component. Renders a `<Link>` when `href` is
 * given, a native `<button>` otherwise — so a "button" that navigates is
 * always a real link (correct semantics, works without JS, middle-click
 * opens in a new tab).
 */
export function Button(props: LinkButtonProps | NativeButtonProps) {
  const { children, variant = "primary", size = "md", className = "" } = props;
  const classes = `${base} ${variantClass[variant]} ${sizeClass[variant][size]} ${className}`;
  const indicator = variant === "text" ? <DirectionalIndicator /> : null;

  if (props.href !== undefined) {
    return (
      <Link
        href={props.href}
        target={props.target}
        rel={props.rel}
        onClick={props.onClick}
        aria-label={props["aria-label"]}
        className={classes}
      >
        {children}
        {indicator}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      disabled={props.disabled}
      onClick={props.onClick}
      aria-label={props["aria-label"]}
      className={classes}
    >
      {children}
      {indicator}
    </button>
  );
}
