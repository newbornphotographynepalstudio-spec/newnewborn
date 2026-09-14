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
import { ServicesOverview } from "@/components/sections/home/ServicesOverview";
import { StudioSection } from "@/components/sections/home/StudioSection";
import { fetchGoogleReviews } from "@/lib/reviews/google-places";
import {
  organizationJsonLd,
  professionalServiceJsonLd,
  websiteJsonLd,
} from "@/lib/seo/jsonld";
import { siteConfig } from "@/lib/seo/site";

const title = "Newborn Photography in Kathmandu, Nepal";
const description =
  "Editorial, safety-led newborn photography in Kathmandu, plus maternity, baby, cake smash and family sessions. Book your studio session today.";

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
 * The homepage. Exactly one <h1> (in HomeHero); every section below it
 * heads with an <h2> (see SectionHeading). No content here is invented —
 * packages/reviews render honest empty states until real data exists (see
 * lib/data/packages.ts, lib/data/reviews.ts).
 *
 * Section order follows the required narrative arc: hero, trust/
 * positioning, the newborn photography experience, featured work,
 * services, safety, the studio, packages, reviews, why families choose
 * this studio (HeritageSection's Nepali-family-heritage positioning is
 * the real, non-invented answer to that question here), FAQ, final CTA.
 * The Service Area section is intentionally NOT rendered here —
 * Kathmandu/Lalitpur/Bhaktapur stay as their own indexable /areas/ pages
 * (linked from the footer) rather than a large homepage section.
 *
 * No homepage section promotes newborn photography training (the "For
 * Photographers" / "Newborn Photography Training" section previously
 * here) — the homepage stays focused on families searching for newborn
 * photography, training's actual audience. Training remains fully live
 * at /training/, linked from the header and footer.
 */
export default async function HomePage() {
  // null in this environment — no GOOGLE_PLACES_API_KEY/PLACE_ID
  // configured, so this always falls back to the honest static empty
  // state (see lib/reviews/google-places.ts and ReviewsSection).
  const liveGoogleReviews = await fetchGoogleReviews();

  const jsonLd = [
    organizationJsonLd(),
    websiteJsonLd(),
    professionalServiceJsonLd(
      liveGoogleReviews
        ? { ratingValue: liveGoogleReviews.rating, reviewCount: liveGoogleReviews.userRatingCount }
        : undefined
    ),
  ];

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
      <ExperienceSteps />
      <FeaturedWork />
      <ServicesOverview />
      <SafetySection />
      <StudioSection />
      <PackagesPreview />
      <ReviewsSection
        liveReviews={liveGoogleReviews?.reviews}
        liveRating={
          liveGoogleReviews
            ? { rating: liveGoogleReviews.rating, userRatingCount: liveGoogleReviews.userRatingCount }
            : undefined
        }
      />
      <HeritageSection />
      <FaqPreview />
      <FinalCta />
    </>
  );
}
