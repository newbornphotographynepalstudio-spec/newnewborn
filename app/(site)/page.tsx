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
import { WhyUsSection } from "@/components/sections/home/WhyUsSection";
import { formatPriceRange, getPackages } from "@/lib/packages/data";
import { fetchGoogleReviews } from "@/lib/reviews/google-places";
import {
  organizationJsonLd,
  professionalServiceJsonLd,
  websiteJsonLd,
} from "@/lib/seo/jsonld";
import { getSiteSettings } from "@/lib/settings/data";
import { buildPageMetadata } from "@/lib/seo/build-metadata";

/** Kept short so the rendered `<title>` (this string + " | " + the site
 * name, via app/layout.tsx's title template) lands at 60 characters —
 * SEMrush flagged the previous version at 67; "Kathmandu" and "Newborn
 * Photography" both stay intact, nothing added to compensate. */
const title = "Newborn Photography in Kathmandu";
/** Trimmed from 141 to 121 characters (SEMrush flagged >130) by cutting
 * one redundant word ("studio", already implied by "Book today") rather
 * than any keyword or claim — every service this session type still
 * names (maternity, baby, cake smash, family) is unchanged. */
const description =
  "Editorial, safety-led newborn photography in Kathmandu, plus maternity, baby, cake smash and family sessions. Book today.";

/** Uses buildPageMetadata (like every other page) so a Page SEO override
 * for "/" actually takes effect; type/locale/siteName/url/card are all
 * filled in by buildPageMetadata itself now (Phase 15.1). */
export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/", {
    title,
    description,
    ogImage: "/photography/culture1.jpg",
  });
}

/**
 * The homepage. Exactly one <h1> (in HomeHero); every section below it
 * heads with an <h2> (see SectionHeading). No content here is invented —
 * packages/reviews render honest empty states until real data exists (see
 * lib/data/packages.ts, lib/data/reviews.ts).
 *
 * Redesign section order (2026 redesign, Aana-inspired arc — emotional
 * hook, distributed trust, then conversion): hero, emotional intro, why-us
 * differentiation (WhyUsSection — a real "Meet Navin" personal-bio
 * section is deferred until a real name/bio/portrait is supplied; see
 * WhyUsSection's own doc comment), featured real photography, services
 * overview (now photo-forward), safety (moved earlier — resolves the
 * newborn-safety anxiety before price is ever mentioned), the session
 * experience teaser (links to the full /experience/ page), the studio,
 * packages/pricing, reviews, heritage/cultural positioning, FAQ, final
 * CTA. The Service Area section is intentionally NOT rendered here —
 * Kathmandu/Lalitpur/Bhaktapur stay as their own indexable /areas/ pages
 * (linked from the footer) rather than a large homepage section.
 *
 * No homepage section promotes newborn photography training (the "For
 * Photographers" / "Newborn Photography Training" section previously
 * here) — the homepage stays focused on families searching for newborn
 * photography, training's actual audience. Training remains fully live
 * at /training/, reachable from MobileNav's secondary links and the
 * footer.
 */
export default async function HomePage() {
  // null in this environment — no GOOGLE_PLACES_API_KEY/PLACE_ID
  // configured, so this always falls back to the honest static empty
  // state (see lib/reviews/google-places.ts and ReviewsSection).
  const [liveGoogleReviews, { seo, socialLinks }, packages] = await Promise.all([
    fetchGoogleReviews(),
    getSiteSettings(),
    getPackages(),
  ]);

  const jsonLd = [
    organizationJsonLd(seo.organizationName, socialLinks),
    websiteJsonLd(),
    professionalServiceJsonLd(
      liveGoogleReviews
        ? { ratingValue: liveGoogleReviews.rating, reviewCount: liveGoogleReviews.userRatingCount }
        : undefined,
      seo.organizationName,
      formatPriceRange(packages)
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
      <WhyUsSection />
      <FeaturedWork />
      <ServicesOverview />
      <SafetySection />
      <ExperienceSteps />
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
