import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import { siteConfig } from "@/lib/seo/site";

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

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    // Site-wide fallback so every page has a social preview image, not
    // just the homepage (which sets its own, identical, explicitly) —
    // found via an audit that 22 of 23 pages had no og:image at all,
    // since only the homepage defined its own `openGraph` and no
    // fallback existed here. Reuses the same real, approved hero photo
    // rather than inventing separate per-page OG art.
    images: [{ url: "/photography/culture1.jpg", width: 2048, height: 1365 }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/photography/culture1.jpg"],
  },
};

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
