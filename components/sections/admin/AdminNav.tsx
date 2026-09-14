"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Bookings", href: "/admin/bookings" },
  { label: "Clients", href: "/admin/clients" },
  { label: "Packages", href: "/admin/packages" },
  { label: "Blog", href: "/admin/blog" },
  { label: "FAQs", href: "/admin/faqs" },
  { label: "Media", href: "/admin/media" },
  { label: "Portfolio", href: "/admin/portfolio" },
  { label: "SEO", href: "/admin/seo" },
  { label: "Settings", href: "/admin/settings" },
  { label: "Security", href: "/admin/security" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin" className="flex flex-wrap gap-1 overflow-x-auto">
      {navItems.map((item) => {
        const isActive = item.href === "/admin" ? pathname === "/admin" || pathname === "/admin/" : pathname?.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`shrink-0 rounded-sm px-3 py-1.5 text-caption font-medium tracking-eyebrow uppercase transition-colors ${
              isActive ? "bg-plum text-white" : "text-charcoal/70 hover:bg-blush/60"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
