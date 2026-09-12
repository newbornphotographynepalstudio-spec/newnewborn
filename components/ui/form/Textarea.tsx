import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";

import { fieldClass } from "@/components/ui/form/Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className = "", rows = 5, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={`${fieldClass} resize-y ${className}`}
      {...props}
    />
  );
});
