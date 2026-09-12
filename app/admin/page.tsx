import { adminModules } from "@/lib/admin/modules";

/**
 * Dashboard foundation. Reachable only when the proxy (middleware)
 * session-cookie gate passes (see /proxy.ts); real data and per-module
 * screens are Phase 2.
 */
export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl text-ink">Dashboard</h1>
      <p className="mt-2 text-sm text-charcoal/70">
        Admin modules planned for this project. Each will get real data,
        forms and role-based access in later phases.
      </p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {adminModules.map((mod) => (
          <li
            key={mod.label}
            className="rounded-sm border border-stone bg-cream p-4"
          >
            <p className="text-sm font-medium text-ink">{mod.label}</p>
            <p className="mt-1 text-xs text-charcoal/60">{mod.description}</p>
            <p className="mt-3 text-[11px] tracking-wide text-charcoal/40 uppercase">
              Min. role: {mod.minimumRole}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
