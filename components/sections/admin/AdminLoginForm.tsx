"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

import { Stack } from "@/components/primitives/Stack";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/form/Input";
import { Label } from "@/components/ui/form/Label";
import { getFirebaseAuth } from "@/lib/firebase/client";

/**
 * Real Firebase Authentication sign-in, wired end-to-end:
 * 1. Sign in with the Firebase client SDK (email/password) to get an ID
 *    token — the password itself never leaves the browser or touches our
 *    server.
 * 2. POST that ID token to /api/admin/session, which verifies it with the
 *    Admin SDK and, only if the user carries the `admin` custom claim,
 *    mints the server-trusted `__session` cookie that
 *    requireAdminSession() (lib/firebase/session.ts) checks on every
 *    protected admin page and Server Action.
 * 3. A real-but-non-admin account is signed out again client-side and
 *    shown a clear "not authorized" message, rather than left in a
 *    half-signed-in state.
 *
 * This cannot be exercised end-to-end without real
 * NEXT_PUBLIC_FIREBASE_* / FIREBASE_* credentials configured (see
 * docs/SETUP.md) and at least one Firebase user with the `admin` custom
 * claim set — neither exists in this environment, so this code path is
 * unverified beyond typecheck/build/lint until those are provisioned.
 */
export function AdminLoginForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    try {
      const auth = getFirebaseAuth();
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await credential.user.getIdToken();

      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        await signOut(auth);
        const body = await response.json().catch(() => null);
        setError(body?.error ?? "Sign-in failed. Please try again.");
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Incorrect email or password.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <Stack gap="md">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="username"
            className="mt-2"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-2"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Signing in…" : "Sign In"}
        </Button>
        {error ? <p className="text-small text-plum">{error}</p> : null}
      </Stack>
    </form>
  );
}
