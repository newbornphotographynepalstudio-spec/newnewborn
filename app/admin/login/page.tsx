import type { Metadata } from "next";

import { Stack } from "@/components/primitives/Stack";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/form/Input";
import { Label } from "@/components/ui/form/Label";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

/**
 * Structural placeholder for the admin sign-in screen, built on the same
 * form primitives (Input/Label/Button) the rest of the site uses. Wiring
 * this to Firebase Authentication (client sign-in → ID token →
 * server-verified session cookie) is a later phase's work, once real
 * Firebase credentials exist.
 */
export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-gutter py-16">
      <h1 className="text-h2 text-plum">Admin Sign In</h1>
      <p className="mt-2 text-small text-charcoal/70">
        Sign-in will be connected to Firebase Authentication in a later
        phase.
      </p>

      <form className="mt-8">
        <Stack gap="md">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              disabled
              className="mt-2"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              disabled
              className="mt-2"
              placeholder="••••••••"
            />
          </div>
          <Button type="button" disabled className="w-full">
            Sign In (not yet connected)
          </Button>
        </Stack>
      </form>
    </div>
  );
}
