import type { ComponentType, SVGProps } from "react";

import {
  BlogIcon,
  BookingsIcon,
  ClientsIcon,
  DashboardIcon,
  FaqIcon,
  MediaIcon,
  PackageIcon,
  PortfolioIcon,
  SecurityIcon,
  SeoIcon,
  SettingsIcon,
} from "@/components/admin/ui/icons";

export type NavItem = {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

/**
 * The admin's real information architecture — every group and item maps
 * to an existing route (see app/admin/(protected)/**), grouped by admin
 * job rather than by folder structure. "SEO" is its own group (not
 * folded into Content) because it spans 3 routes with real, distinct
 * jobs (global settings, per-page overrides, a read-only schema
 * inspector) — flattening it into Content would bury two of the three.
 * No group here corresponds to functionality that doesn't exist (no
 * "Testimonials," no "About/Studio" editor — neither has an admin route).
 */
export const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: DashboardIcon }],
  },
  {
    label: "Content",
    items: [
      { label: "Blog", href: "/admin/blog", icon: BlogIcon },
      { label: "FAQs", href: "/admin/faqs", icon: FaqIcon },
      { label: "Packages & Pricing", href: "/admin/packages", icon: PackageIcon },
    ],
  },
  {
    label: "Media",
    items: [
      { label: "Media Library", href: "/admin/media", icon: MediaIcon },
      { label: "Portfolio", href: "/admin/portfolio", icon: PortfolioIcon },
    ],
  },
  {
    label: "Business",
    items: [
      { label: "Bookings", href: "/admin/bookings", icon: BookingsIcon },
      { label: "Clients", href: "/admin/clients", icon: ClientsIcon },
    ],
  },
  {
    label: "SEO",
    items: [{ label: "SEO", href: "/admin/seo", icon: SeoIcon }],
  },
  {
    label: "Settings",
    items: [
      { label: "Site Settings", href: "/admin/settings", icon: SettingsIcon },
      { label: "Security", href: "/admin/security", icon: SecurityIcon },
    ],
  },
];
