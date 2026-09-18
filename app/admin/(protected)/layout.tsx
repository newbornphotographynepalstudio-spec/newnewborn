import { requireAdminSession } from "@/lib/firebase/session";
import { AdminShell } from "@/components/admin/shell/AdminShell";

/**
 * The real authorization boundary for every admin screen except
 * /admin/login (a sibling route outside this group, so it isn't wrapped
 * here). requireAdminSession() cryptographically verifies the session
 * cookie with the Firebase Admin SDK and checks the `admin` custom claim —
 * see lib/firebase/session.ts and proxy.ts for why that's necessary
 * (Edge middleware alone can only check cookie presence). Redirects to
 * /admin/login when there's no valid admin session, so nothing below this
 * layout renders for an unauthenticated or non-admin request.
 *
 * The decoded session's email is passed straight into AdminShell (a
 * client component) for display — the shell itself never touches
 * auth/cookies directly.
 */
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminSession();

  return <AdminShell adminEmail={session.email}>{children}</AdminShell>;
}
