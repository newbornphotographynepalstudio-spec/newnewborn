import type { Metadata } from "next";

import { BrandIntro } from "@/components/sections/home/BrandIntro";
import { ExperienceSteps } from "@/components/sections/home/ExperienceSteps";
import { FaqPreview } from "@/components/sections/home/FaqPreview";
import { FeaturedWork } from "@/components/sections/home/FeaturedWork";
import { FinalCta } from "@/components/sections/home/FinalCta";
import { HeritageSection } from "@/components/sections/home/HeritageSection";
import { HomeHero } from "@/components/sections/home/HomeHero";
import { PackagesPreview } from "@/components/sections/home/PackagesPreview";
import { ReviewsSection } from "@/components/sections/home/ReviewsSection";
import { SafetySection } from "@/components/sections/home/SafetySection";
import { ServiceAreaSection } from "@/components/sections/home/ServiceAreaSection";
import { ServicesOverview } from "@/components/sections/home/ServicesOverview";
import { StudioSection } from "@/components/sections/home/StudioSection";
import { TrainingSection } from "@/components/sections/home/TrainingSection";
import {
  organizationJsonLd,
  professionalServiceJsonLd,
  websiteJsonLd,
} from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/seo/site";

const title = "Newborn Photography in Kathmandu, Nepal";
const description =
  "Premium newborn photography in Kathmandu, Nepal. Editorial, safety-led studio sessions for newborns, maternity, baby, cake smash and family portraits — book your session with Newborn Photography Nepal.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    url: siteConfig.url,
    title,
    description,
    images: [{ url: "/photography/culture1.jpg", width: 2048, height: 1365 }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/photography/culture1.jpg"],
  },
};

/**
 * The Phase 3 homepage. Exactly one <h1> (in HomeHero); every section
 * below it heads with an <h2> (see SectionHeading). No content here is
 * invented — packages/reviews render honest empty states until real data
 * exists (see lib/data/packages.ts, lib/data/reviews.ts).
 */
export default function HomePage() {
  const jsonLd = [organizationJsonLd(), websiteJsonLd(), professionalServiceJsonLd()];

  return (
    <>
      {jsonLd.map((entry, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
        />
      ))}

      <HomeHero />
      <BrandIntro />
      <ServicesOverview />
      <FeaturedWork />
      <ExperienceSteps />
      <SafetySection />
      <StudioSection />
      <HeritageSection />
      <PackagesPreview />
      <ReviewsSection />
      <TrainingSection />
      <ServiceAreaSection />
      <FaqPreview />
      <FinalCta />
    </>
  );
}
