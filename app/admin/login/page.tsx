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
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-plum font-display text-lg font-medium text-white">
          N
        </div>
        <h1 className="mt-5 text-center text-xl font-semibold text-slate-900">Admin Sign In</h1>
        <p className="mt-1.5 text-center text-sm text-slate-500">
          Newborn Photography Nepal — sign in with your admin account.
        </p>

        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <AdminLoginForm redirectTo={redirectTo} />
        </div>
      </div>
    </div>
  );
}
