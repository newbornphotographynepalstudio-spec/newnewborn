/**
 * Global site constants used for default SEO metadata, the sitemap and
 * robots.txt. Real editable per-page/global SEO values (title, description,
 * OG image, verification IDs, analytics IDs, etc.) will live in the
 * `seoSettings` / `websiteSettings` Firestore documents and be managed from
 * the admin SEO Settings and Website Settings screens (Phase 2+). Until
 * then this file holds only the facts already provided for this project.
 */

export const siteConfig = {
  name: "Newborn Photography Nepal",
  tagline: "Newborn, maternity, baby, cake smash and family photography by Navin",
  description:
    "Newborn Photography Nepal by Navin — newborn, maternity, baby, cake smash and family photography studio serving Kathmandu Valley, Nepal, with photography training for photographers.",
  // Falls back to the real production domain (not localhost) so a
  // deploy that forgets to set NEXT_PUBLIC_SITE_URL still gets correct
  // canonical/OG URLs; override with NEXT_PUBLIC_SITE_URL=http://localhost:3000
  // in .env.local for local development if that distinction matters to you.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://newbornphotographynepal.studio",
  locale: "en_US",
} as const;
