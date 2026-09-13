import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: ReactNode;
};

export const Radio = forwardRef<HTMLInputElement, Props>(function Radio(
  { label, className = "", id, ...props },
  ref
) {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-start gap-3 text-small text-charcoal ${className}`}
    >
      <input
        ref={ref}
        id={id}
        type="radio"
        className="mt-0.5 h-4 w-4 shrink-0 accent-plum"
        {...props}
      />
      <span>{label}</span>
    </label>
  );
});
