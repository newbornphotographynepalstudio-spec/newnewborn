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
    metadataBase: new URL(siteConfig.url),
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
