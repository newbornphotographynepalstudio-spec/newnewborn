import type { ReactNode } from "react";

/**
 * The admin's one "nothing here yet" treatment — replaces the dashed
 * `border-dashed border-taupe/40` boxes repeated (with slightly
 * different wording each time) across almost every list page. Always
 * explains what's empty and, where one exists, offers the next action —
 * never just a bare "No items."
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-12 text-center">
      {icon ? <div className="mb-3 text-slate-400">{icon}</div> : null}
      <p className="text-sm font-medium text-slate-700">{title}</p>
      {description ? <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
