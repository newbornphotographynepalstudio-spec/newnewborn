import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StarRating } from "@/components/ui/StarRating";
import { googleReviewsUrl, reviews } from "@/lib/data/reviews";

/**
 * No review, name or rating is invented — this renders only what's in
 * lib/data/reviews.ts. That's currently an empty array: this business has
 * a real Google Business Profile and review link (googleReviewsUrl below
 * is genuine, not a placeholder), but no actual review text/names/ratings
 * have been supplied to this codebase to display. The empty state below
 * is deliberately NOT framed as "coming soon" — it redirects confidently
 * to the real reviews that already exist on Google, which is more honest
 * than implying something is missing.
 *
 * The `reviews.length > 0` branch (unexercised today, ready for when
 * real reviews are connected) is a stacked, divided editorial list —
 * deliberately not a 3-up card grid, per the brand's "not a SaaS
 * template" direction.
 */
export function ReviewsSection() {
  return (
    <Section tone="blush">
      <SectionHeading
        eyebrow="Google Reviews"
        title="Loved by families"
        description="Real experiences from families who chose Newborn Photography Nepal for their sessions."
        align="center"
      />

      {reviews.length > 0 ? (
        <div className="mx-auto mt-14 max-w-2xl divide-y divide-taupe/20">
          {reviews.map((review) => (
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
          <p aria-hidden className="font-display text-h1 leading-none text-plum/15">
            &ldquo;
          </p>
          <p className="-mt-6 text-body-lg leading-relaxed text-charcoal/75">
            Read what families have shared about their experience with
            Newborn Photography Nepal.
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
