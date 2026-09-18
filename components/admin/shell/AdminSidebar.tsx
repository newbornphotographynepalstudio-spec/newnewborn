"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navGroups } from "@/components/admin/shell/nav-config";
import { CloseIcon } from "@/components/admin/ui/icons";

function isActive(pathname: string | null, href: string) {
  if (href === "/admin") return pathname === "/admin" || pathname === "/admin/";
  return pathname?.startsWith(href) ?? false;
}

function SidebarNav({ pathname, onNavigate }: { pathname: string | null; onNavigate?: () => void }) {
  return (
    <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3 py-4">
      {navGroups.map((group) => (
        <div key={group.label} className="mb-5 last:mb-0">
          <p className="px-2.5 text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
            {group.label}
          </p>
          <ul className="mt-1.5 space-y-0.5">
            {group.items.map((item) => {
              const active = isActive(pathname, item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-plum/10 text-plum"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon width={17} height={17} className="shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function BrandMark() {
  return (
    <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-slate-200 px-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-plum font-display text-sm font-medium text-white">
        N
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-900">Newborn Photography Nepal</p>
        <p className="text-[11px] text-slate-400">Admin</p>
      </div>
    </div>
  );
}

/** Fixed, always-visible on desktop (lg+). */
export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
      <BrandMark />
      <SidebarNav pathname={pathname} />
    </aside>
  );
}

/** Slide-in drawer on mobile/tablet, opened from AdminHeader's menu button. */
export function AdminMobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  return (
    <div
      className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-slate-900/40 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Admin navigation"
        className={`absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-white shadow-lg transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 px-4">
          <p className="text-sm font-semibold text-slate-900">Menu</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <CloseIcon width={18} height={18} />
          </button>
        </div>
        <SidebarNav pathname={pathname} onNavigate={onClose} />
      </div>
    </div>
  );
}
