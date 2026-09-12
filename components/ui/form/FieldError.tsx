import type { HTMLAttributes } from "react";

/** Pair with an input via `aria-describedby={id}` on the input, `id` here. */
export function FieldError({
  className = "",
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p role="alert" className={`text-caption text-plum ${className}`} {...props} />
  );
}
