import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StarRating } from "@/components/ui/StarRating";
import { googleReviewsUrl, reviews as staticReviews } from "@/lib/data/reviews";
import type { Review } from "@/lib/reviews/types";

/**
 * No review, name or rating is invented. By default this renders only
 * what's in lib/data/reviews.ts (currently an empty array — this
 * business has a real Google Business Profile and review link,
 * `googleReviewsUrl` below is genuine, but no actual review text/names/
 * ratings have been supplied to this codebase). `liveReviews`/
 * `liveRating` let a caller (the homepage) pass real data fetched from
 * the Google Places API at request time (see
 * lib/reviews/google-places.ts) — when present, live data takes over;
 * when absent (as in this environment, which has no Google API
 * credentials configured), the static empty state below is exactly what
 * renders. The empty state is deliberately NOT framed as "coming soon"
 * — it redirects confidently to the real reviews that already exist on
 * Google, which is more honest than implying something is missing.
 *
 * The has-reviews branch is a stacked, divided editorial list —
 * deliberately not a 3-up card grid, per the brand's "not a SaaS
 * template" direction.
 */
export function ReviewsSection({
  liveReviews,
  liveRating,
}: {
  liveReviews?: Review[];
  liveRating?: { rating: number; userRatingCount: number };
} = {}) {
  const displayedReviews = liveReviews ?? staticReviews;

  return (
    <Section tone="blush">
      <SectionHeading
        eyebrow="Google Reviews"
        title="Loved by families"
        description="Real experiences from families who chose Newborn Photography Nepal for their sessions."
        align="center"
      />

      {liveRating && liveRating.userRatingCount > 0 ? (
        <div className="mt-6 flex items-center justify-center gap-2 text-small text-charcoal/75">
          <StarRating rating={Math.round(liveRating.rating) as 1 | 2 | 3 | 4 | 5} />
          <span>
            {liveRating.rating.toFixed(1)} from {liveRating.userRatingCount} Google reviews
          </span>
        </div>
      ) : null}

      {displayedReviews.length > 0 ? (
        <div className="mx-auto mt-14 max-w-2xl divide-y divide-taupe/20">
          {displayedReviews.map((review) => (
            <div key={review.id} className="py-8 first:pt-0 last:pb-0">
              <StarRating rating={review.rating} />
              <p className="mt-4 font-display text-h4 leading-relaxed text-charcoal/90">
                &ldquo;{review.text}&rdquo;
              </p>
              <p className="mt-4 text-small font-medium text-plum">{review.reviewerName}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mx-auto mt-12 max-w-lg text-center">
          <p className="text-body-lg leading-relaxed text-charcoal/75">
            See our latest Google reviews to read what families have shared
            about their experience with Newborn Photography Nepal.
          </p>
        </div>
      )}

      <div className="mt-10 flex flex-col items-center gap-3">
        <Button href={googleReviewsUrl} target="_blank" rel="noopener noreferrer">
          Read All Reviews on Google
        </Button>
        <a
          href={googleReviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-caption tracking-eyebrow text-taupe uppercase underline-offset-4 hover:text-plum hover:underline"
        >
          Share Your Experience on Google
        </a>
      </div>
    </Section>
  );
}
