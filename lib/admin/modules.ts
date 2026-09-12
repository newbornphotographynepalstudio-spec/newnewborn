import type { AdminRole } from "@/lib/auth/roles";

/**
 * Planned admin modules (Phase 2+). Listed now so the dashboard foundation
 * and the eventual navigation/authorization wiring have one shared source.
 * `minimumRole` is a placeholder assignment to validate the role model
 * reads sensibly end to end — revisit per module as real workflows emerge.
 */
export type AdminModule = {
  label: string;
  description: string;
  minimumRole: AdminRole;
};

export const adminModules: AdminModule[] = [
  { label: "Leads / Inquiries", description: "Incoming enquiries from the public site.", minimumRole: "PHOTOGRAPHER_STAFF" },
  { label: "Bookings", description: "Confirmed sessions and scheduling.", minimumRole: "PHOTOGRAPHER_STAFF" },
  { label: "Portfolio / Galleries", description: "Published photography galleries.", minimumRole: "EDITOR" },
  { label: "Services", description: "Newborn, maternity, baby, cake smash, family.", minimumRole: "ADMIN" },
  { label: "Packages & Pricing", description: "Session packages, albums, frames, prints.", minimumRole: "ADMIN" },
  { label: "Blog / Articles", description: "Blog content and categories.", minimumRole: "EDITOR" },
  { label: "Testimonials", description: "Client testimonials.", minimumRole: "EDITOR" },
  { label: "FAQs", description: "Frequently asked questions.", minimumRole: "EDITOR" },
  { label: "Media Library", description: "Uploaded photography and site images.", minimumRole: "EDITOR" },
  { label: "Pages", description: "Editable site page content.", minimumRole: "ADMIN" },
  { label: "SEO Settings", description: "Per-page and global SEO metadata.", minimumRole: "ADMIN" },
  { label: "Website Settings", description: "Global site settings.", minimumRole: "SUPER_ADMIN" },
  { label: "Social Links", description: "Social media profile links.", minimumRole: "ADMIN" },
  { label: "Contact Information", description: "Studio contact details.", minimumRole: "ADMIN" },
  { label: "Analytics Integrations", description: "GA4, GTM, Meta Pixel IDs.", minimumRole: "SUPER_ADMIN" },
  { label: "Training", description: "Photographer training offerings.", minimumRole: "ADMIN" },
  { label: "Areas", description: "Service area pages.", minimumRole: "ADMIN" },
  { label: "Redirect Manager", description: "URL redirects (e.g. /workshop/ → /training/).", minimumRole: "SUPER_ADMIN" },
  { label: "Admin Users", description: "Admin accounts and roles.", minimumRole: "SUPER_ADMIN" },
  { label: "Audit Logs", description: "Record of privileged admin actions.", minimumRole: "SUPER_ADMIN" },
  { label: "Backup / Data Export", description: "Data export and backup.", minimumRole: "SUPER_ADMIN" },
];
