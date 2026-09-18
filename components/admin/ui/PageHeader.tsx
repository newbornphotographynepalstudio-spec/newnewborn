import Link from "next/link";
import type { ReactNode } from "react";

import { ArrowLeftIcon } from "@/components/admin/ui/icons";

/**
 * Every admin page's title block — replaces the `<h1 className="text-h2
 * text-plum">` + separate description paragraph pattern repeated
 * (inconsistently) across all 21 admin routes, plus an optional back
 * link and a primary-action slot (Add FAQ, New Post, Upload, …).
 */
export function PageHeader({
  title,
  description,
  back,
  action,
}: {
  title: ReactNode;
  description?: ReactNode;
  back?: { href: string; label: string };
  action?: ReactNode;
}) {
  return (
    <div className="mb-6">
      {back ? (
        <Link
          href={back.href}
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeftIcon width={16} height={16} />
          {back.label}
        </Link>
      ) : null}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-sans text-xl font-semibold text-slate-900 sm:text-2xl">{title}</h1>
          {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}
