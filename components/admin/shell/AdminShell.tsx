"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import { AdminHeader } from "@/components/admin/shell/AdminHeader";
import { AdminMobileDrawer, AdminSidebar } from "@/components/admin/shell/AdminSidebar";

/**
 * The one layout every protected admin route renders inside (wired from
 * app/admin/(protected)/layout.tsx, which does the real
 * requireAdminSession() auth check server-side before this ever
 * mounts). Owns only the mobile-drawer open/close state — everything
 * else (which route is active, sign-out) is either derived from the URL
 * or handled by its own component.
 */
export function AdminShell({ adminEmail, children }: { adminEmail?: string; children: ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <AdminMobileDrawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader adminEmail={adminEmail} onMenuClick={() => setMobileNavOpen(true)} />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
