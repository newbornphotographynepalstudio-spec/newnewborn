"use client";

import { SignOutButton } from "@/components/sections/admin/SignOutButton";
import { MenuIcon } from "@/components/admin/ui/icons";

/**
 * The global top bar. Kept deliberately sparse — no fake notification
 * bell, no search box, since nothing in this admin currently produces
 * notifications and every list page already has its own real search
 * (BookingsTable, MediaLibraryGrid) where search is actually useful.
 * Account/session controls (email + sign out) are visually separated
 * here from the primary nav in the sidebar, per the redesign brief.
 */
export function AdminHeader({ adminEmail, onMenuClick }: { adminEmail?: string; onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-sm sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="-ml-1 flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
      >
        <MenuIcon width={19} height={19} />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-3">
        {adminEmail ? (
          <span className="hidden max-w-[200px] truncate text-xs text-slate-500 sm:inline">{adminEmail}</span>
        ) : null}
        <div className="h-4 w-px bg-slate-200" aria-hidden />
        <SignOutButton />
      </div>
    </header>
  );
}
