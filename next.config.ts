import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Canonical URLs use a trailing slash (matches the route map in
  // docs/ARCHITECTURE.md), so enforce it consistently.
  trailingSlash: true,

  images: {
    // Original files are never referenced directly in page markup, only
    // via next/image. Media Library uploads are served from Supabase
    // Storage (this project stays on the Firebase Spark plan, which
    // doesn't include Firebase Storage — Firestore/Auth remain on
    // Firebase; see lib/supabase/admin.ts). The firebasestorage.googleapis.com
    // pattern is kept for forward-compatibility with any future Firebase
    // Storage usage, but nothing currently uses it.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },

  async redirects() {
    return [
      // Training is the canonical route; /training/ is authoritative.
      // `statusCode: 301` (not `permanent: true`, which Next.js maps to
      // 308) — this is an intentional SEO migration and must be a literal
      // HTTP 301 for search engines to consolidate ranking onto /training/.
      {
        source: "/workshop/",
        destination: "/training/",
        statusCode: 301,
      },
      {
        source: "/workshop",
        destination: "/training/",
        statusCode: 301,
      },
      {
        source: "/workshops/",
        destination: "/training/",
        statusCode: 301,
      },
      {
        source: "/workshops",
        destination: "/training/",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
