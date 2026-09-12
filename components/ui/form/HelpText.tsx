import type { HTMLAttributes } from "react";

export function HelpText({
  className = "",
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-caption text-taupe ${className}`} {...props} />
  );
}
