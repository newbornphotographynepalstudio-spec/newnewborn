import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import { siteConfig } from "@/lib/seo/site";
import { getSiteSettings } from "@/lib/settings/data";

import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

/** `new URL(siteConfig.url)` is the single highest-blast-radius line in
 * this app — every route's generateMetadata inherits this layout's, so a
 * bad value here throws on every request for every dynamic route (found
 * live: an env var that was set-but-blank made siteConfig.url an empty
 * string, which took down /admin/login/, /book-a-session/ and every
 * other dynamic route with a 500, while already-prerendered static
 * pages kept serving fine — see lib/seo/site.ts for the actual value
 * fix). siteConfig.url can't produce that specific failure anymore, but
 * this still guards the one call every request depends on, rather than
 * trusting it can never be invalid again. */
function safeMetadataBase(url: string): URL {
  try {
    return new URL(url);
  } catch (error) {
    console.error("Invalid siteConfig.url, falling back to the production domain:", url, error);
    return new URL("https://www.newbornphotographynpl.com");
  }
}

/**
 * `generateMetadata` (not a static `export const metadata`) so this can
 * read admin-editable Global SEO overrides from Firestore
 * (lib/settings/data.ts) — every field falls back to the original,
 * hardcoded siteConfig value when left blank in admin, so an unconfigured
 * settings document produces byte-identical metadata to before this
 * existed. `revalidatePath("/", "layout")` in
 * lib/settings/actions.ts#saveGlobalSeo is what makes an edit here
 * actually take effect without a rebuild.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSiteSettings();
  const name = seo.siteName || siteConfig.name;
  const tagline = seo.tagline || siteConfig.tagline;
  const description = seo.defaultDescription || siteConfig.description;
  const ogImage = seo.defaultOgImage || "/photography/culture1.jpg";

  return {
    metadataBase: safeMetadataBase(siteConfig.url),
    title: {
      default: `${name} | ${tagline}`,
      template: `%s | ${name}`,
    },
    description,
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      siteName: name,
      title: name,
      description,
      // Site-wide fallback so every page has a social preview image, not
      // just the homepage (which sets its own, identical, explicitly) —
      // found via an audit that 22 of 23 pages had no og:image at all,
      // since only the homepage defined its own `openGraph` and no
      // fallback existed here. Reuses the same real, approved hero photo
      // rather than inventing separate per-page OG art, unless an admin
      // sets a different default.
      images: [{ url: ogImage, width: 2048, height: 1365 }],
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description,
      images: [ogImage],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${manrope.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
