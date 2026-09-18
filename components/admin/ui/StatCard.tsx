import type { ReactNode } from "react";

/** Formalizes the `StatCard` function duplicated separately (with
 * slightly different markup each time) in the dashboard and SEO
 * overview pages into one shared component. */
export function StatCard({
  label,
  value,
  suffix,
  tone = "default",
  icon,
}: {
  label: string;
  value: ReactNode;
  suffix?: string;
  tone?: "default" | "accent" | "warning";
  icon?: ReactNode;
}) {
  const valueTone =
    tone === "accent" ? "text-plum" : tone === "warning" ? "text-amber-600" : "text-slate-900";
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">{label}</p>
        {icon ? <span className="text-slate-300">{icon}</span> : null}
      </div>
      <p className={`mt-2 font-sans text-2xl font-semibold ${valueTone}`}>
        {value}
        {suffix ? <span className="ml-1 text-sm font-normal text-slate-400">{suffix}</span> : null}
      </p>
    </div>
  );
}
