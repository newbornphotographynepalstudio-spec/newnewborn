import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";

import { fieldClass } from "@/components/ui/form/Input";

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className = "", children, ...props }, ref) {
  return (
    <select ref={ref} className={`${fieldClass} ${className}`} {...props}>
      {children}
    </select>
  );
});
