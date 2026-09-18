import type { ReactNode } from "react";

/**
 * The admin's one table treatment. Scrolls horizontally within its own
 * bordered container on narrow viewports (never the page itself) rather
 * than forcing a bespoke card layout per table — every admin list here
 * is naturally tabular (bookings, clients, packages, posts), so a clean,
 * contained horizontal scroll reads better than collapsing columns into
 * stacked label/value pairs.
 */
export function Table({ children, minWidth = 640 }: { children: ReactNode; minWidth?: number }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-left text-sm" style={{ minWidth }}>
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children }: { children: ReactNode }) {
  return (
    <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-medium tracking-wide text-slate-500 uppercase">
      <tr>{children}</tr>
    </thead>
  );
}

export function Th({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return <th className={`px-4 py-3 font-medium ${className}`}>{children}</th>;
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-slate-100">{children}</tbody>;
}

export function Tr({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <tr className={`transition-colors hover:bg-slate-50 ${className}`}>{children}</tr>;
}

export function Td({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return <td className={`px-4 py-3 align-top text-slate-700 ${className}`}>{children}</td>;
}
