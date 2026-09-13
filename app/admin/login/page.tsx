import type { Metadata } from "next";

import { AdminLoginForm } from "@/components/sections/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

/**
 * Real Firebase Authentication sign-in (see AdminLoginForm for the full
 * client sign-in → ID token → server-verified session cookie flow). The
 * `redirect` search param — set by proxy.ts when it bounces an
 * unauthenticated visitor here — is where a successful sign-in sends the
 * user back to.
 */
export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  const redirectTo = redirect && redirect.startsWith("/admin") ? redirect : "/admin";

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-gutter py-16">
      <h1 className="text-h2 text-plum">Admin Sign In</h1>
      <p className="mt-2 text-small text-charcoal/70">
        Sign in with your admin account.
      </p>

      <AdminLoginForm redirectTo={redirectTo} />
    </div>
  );
}
