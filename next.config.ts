import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Canonical URLs use a trailing slash (matches the route map in
  // docs/ARCHITECTURE.md), so enforce it consistently.
  trailingSlash: true,

  images: {
    // Photography will be served from Firebase Storage; original files are
    // never referenced directly in page markup, only via next/image.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
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
