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
      {
        // Training is the canonical route; /training/ is authoritative.
        source: "/workshop/",
        destination: "/training/",
        permanent: true,
      },
      {
        source: "/workshop",
        destination: "/training/",
        permanent: true,
      },
      {
        source: "/workshops/",
        destination: "/training/",
        permanent: true,
      },
      {
        source: "/workshops",
        destination: "/training/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
