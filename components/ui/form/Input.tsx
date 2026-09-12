import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

export const fieldClass =
  "w-full rounded-sm border border-taupe/40 bg-white px-sm py-xs text-body text-charcoal placeholder:text-taupe transition-colors duration-base ease-premium focus:border-plum focus:outline-none aria-invalid:border-plum disabled:cursor-not-allowed disabled:opacity-50";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className = "", ...props }, ref) {
    return <input ref={ref} className={`${fieldClass} ${className}`} {...props} />;
  }
);
