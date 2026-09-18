import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";

/**
 * The admin's own button component — deliberately separate from
 * components/ui/Button.tsx (the public marketing site's CTA component,
 * used across 20+ public pages). Sharing one component between "book a
 * session" hero CTAs and a dense admin data table would force a choice
 * between breaking the public site's look or leaving the admin stuck
 * with oversized marketing buttons; this keeps both free to serve their
 * own context. Renders a <Link> when `href` is given, a native <button>
 * otherwise, so a navigating "button" is always real, accessible markup.
 */
type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

const base =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum disabled:pointer-events-none disabled:opacity-50";

const variantClass: Record<Variant, string> = {
  primary: "bg-plum text-white hover:bg-plum/90",
  secondary: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  danger: "text-red-600 hover:bg-red-50",
};

const sizeClass: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-9 px-4 text-sm",
};

type BaseProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  "aria-label"?: string;
  icon?: ReactNode;
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

export function AdminButton(props: LinkButtonProps | NativeButtonProps) {
  const { children, variant = "secondary", size = "md", className = "", icon } = props;
  const classes = `${base} ${variantClass[variant]} ${sizeClass[size]} ${className}`;

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
        {icon}
        {children}
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
      {icon}
      {children}
    </button>
  );
}
