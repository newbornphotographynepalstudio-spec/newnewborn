"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";

import { getFirebaseAuth } from "@/lib/firebase/client";
import { LogoutIcon } from "@/components/admin/ui/icons";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    setPending(true);
    try {
      await fetch("/api/admin/session", { method: "DELETE" });
      await signOut(getFirebaseAuth());
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={pending}
      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
    >
      <LogoutIcon width={15} height={15} />
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
