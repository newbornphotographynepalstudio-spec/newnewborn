import { requireAdminSession } from "@/lib/firebase/session";
import { AdminNav } from "@/components/sections/admin/AdminNav";
import { SignOutButton } from "@/components/sections/admin/SignOutButton";

/**
 * The real authorization boundary for every admin screen except
 * /admin/login (a sibling route outside this group, so it isn't wrapped
 * here). requireAdminSession() cryptographically verifies the session
 * cookie with the Firebase Admin SDK and checks the `admin` custom claim —
 * see lib/firebase/session.ts and proxy.ts for why that's necessary
 * (Edge middleware alone can only check cookie presence). Redirects to
 * /admin/login when there's no valid admin session, so nothing below this
 * layout renders for an unauthenticated or non-admin request.
 */
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminSession();

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-taupe/10 bg-white px-gutter py-3">
        <AdminNav />
        <SignOutButton />
      </div>
      {children}
    </>
  );
}
