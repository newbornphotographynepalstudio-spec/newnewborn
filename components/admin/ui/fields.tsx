import { forwardRef } from "react";
import type {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

/**
 * The admin's own form-field kit — separate from components/ui/form/*
 * (the public site's booking-form fields) for the same reason as
 * AdminButton: those are shared across public pages this redesign must
 * not touch. Every field here shares one visual language (compact,
 * slate-bordered, rounded-lg, plum focus ring) instead of each admin
 * form inventing its own inline Tailwind classes, which is what every
 * existing admin form currently did independently.
 */
export const adminFieldClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-plum focus:outline-none focus:ring-2 focus:ring-plum/15 aria-invalid:border-red-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

export const AdminInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function AdminInput({ className = "", ...props }, ref) {
    return <input ref={ref} className={`${adminFieldClass} ${className}`} {...props} />;
  }
);

export const AdminTextarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function AdminTextarea({ className = "", rows = 4, ...props }, ref) {
    return <textarea ref={ref} rows={rows} className={`${adminFieldClass} resize-y ${className}`} {...props} />;
  }
);

export const AdminSelect = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function AdminSelect({ className = "", children, ...props }, ref) {
    return (
      <select ref={ref} className={`${adminFieldClass} pr-8 ${className}`} {...props}>
        {children}
      </select>
    );
  }
);

export const AdminCheckbox = forwardRef<
  HTMLInputElement,
  Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { label: ReactNode }
>(function AdminCheckbox({ label, className = "", id, ...props }, ref) {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-center gap-2 text-sm text-slate-700 ${className}`}
    >
      <input
        ref={ref}
        id={id}
        type="checkbox"
        className="h-4 w-4 shrink-0 rounded border-slate-300 accent-plum"
        {...props}
      />
      <span>{label}</span>
    </label>
  );
});

export function AdminLabel({ className = "", ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={`mb-1.5 block text-sm font-medium text-slate-700 ${className}`} {...props} />;
}

export function AdminHelpText({ className = "", ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`mt-1.5 text-xs text-slate-500 ${className}`} {...props} />;
}

export function AdminFieldError({ className = "", ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p role="alert" className={`mt-1.5 text-xs text-red-600 ${className}`} {...props} />;
}

/**
 * Groups a label + control + optional help text with consistent
 * spacing, so form components stop repeating the same label/margin
 * markup around every single field (every existing admin form
 * duplicated this block verbatim).
 */
export function FormField({
  label,
  htmlFor,
  help,
  required,
  children,
  className = "",
}: {
  label: ReactNode;
  htmlFor: string;
  help?: ReactNode;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <AdminLabel htmlFor={htmlFor}>
        {label}
        {required ? <span className="ml-0.5 text-red-500">*</span> : null}
      </AdminLabel>
      {children}
      {help ? <AdminHelpText>{help}</AdminHelpText> : null}
    </div>
  );
}
