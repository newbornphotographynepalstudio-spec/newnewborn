import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Canonical URLs use a trailing slash (matches the route map in
  // docs/ARCHITECTURE.md), so enforce it consistently.
  trailingSlash: true,

  // firebase-admin (and its transitive google-gax/@grpc/grpc-js/
  // google-auth-library deps) loads some of its own internal files via
  // dynamic require()/fs reads rather than statically-analyzable imports.
  // Vercel's Node File Trace can miss those when the package is bundled
  // normally, producing a runtime-only "module not found"-style crash on
  // every dynamic route that imports lib/firebase/admin.ts — reproduced
  // identically across two separate fresh Vercel projects, never on
  // localhost (next start runs against the full, untraced node_modules
  // tree). Marking it external tells Next.js to copy the whole package
  // into the function bundle instead of tracing/bundling it.
  serverExternalPackages: ["firebase-admin"],

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
