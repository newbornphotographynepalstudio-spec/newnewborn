import { adminModules } from "@/lib/admin/modules";

/**
 * Dashboard foundation. Reachable only when the proxy (middleware)
 * session-cookie gate passes (see /proxy.ts); real data, per-module screens
 * and the real admin UI design are later phases.
 */
export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-gutter py-2xl">
      <h1 className="text-h2 text-plum">Dashboard</h1>
      <p className="mt-2xs text-small text-charcoal/70">
        Admin modules planned for this project. Each will get real data,
        forms and role-based access in later phases.
      </p>

      <ul className="mt-lg grid gap-md sm:grid-cols-2 lg:grid-cols-3">
        {adminModules.map((mod) => (
          <li
            key={mod.label}
            className="rounded-sm border border-taupe/20 bg-white p-md"
          >
            <p className="text-small font-medium text-plum">{mod.label}</p>
            <p className="mt-3xs text-caption text-charcoal/60">{mod.description}</p>
            <p className="mt-xs text-caption tracking-eyebrow text-charcoal/40 uppercase">
              Min. role: {mod.minimumRole}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
