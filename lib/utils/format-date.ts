/**
 * `Date.prototype.toLocaleDateString()`/`toLocaleString()` with no locale
 * argument use the runtime's default locale — which differs between the
 * server (Node's environment locale) and the browser (the visitor's own
 * locale), producing different text for the same date. In any component
 * that hydrates on the client, React then reports a hydration mismatch
 * (confirmed live on /admin/bookings/: server rendered "9/14/2026",
 * client rendered "14/09/2026" for the same timestamp). Passing an
 * explicit locale makes the output identical everywhere, regardless of
 * server or visitor locale — use these instead of calling
 * `toLocaleDateString()`/`toLocaleString()` directly.
 */

export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleDateString("en-US");
}

export function formatDateTime(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleString("en-US");
}

export function formatDateLong(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
