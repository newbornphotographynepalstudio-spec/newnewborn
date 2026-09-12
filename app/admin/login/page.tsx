import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

/**
 * Structural placeholder for the admin sign-in screen. Wiring this to
 * Firebase Authentication (client sign-in → ID token → server-verified
 * session cookie) is Phase 2 work, once real Firebase credentials exist.
 */
export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6 py-10">
      <h1 className="text-2xl text-ink">Admin Sign In</h1>
      <p className="mt-2 text-sm text-charcoal/70">
        Sign-in will be connected to Firebase Authentication in Phase 2.
      </p>

      <form className="mt-8 space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-medium text-charcoal/70"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            disabled
            className="mt-1 w-full rounded-sm border border-stone bg-cream px-3 py-2 text-sm disabled:opacity-60"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-xs font-medium text-charcoal/70"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            disabled
            className="mt-1 w-full rounded-sm border border-stone bg-cream px-3 py-2 text-sm disabled:opacity-60"
            placeholder="••••••••"
          />
        </div>
        <button
          type="button"
          disabled
          className="w-full rounded-sm bg-ink px-4 py-2.5 text-sm text-cream opacity-60"
        >
          Sign In (not yet connected)
        </button>
      </form>
    </div>
  );
}
