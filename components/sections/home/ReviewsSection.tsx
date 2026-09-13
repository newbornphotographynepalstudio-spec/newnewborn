import { EditorialGrid } from "@/components/primitives/EditorialGrid";
import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StarRating } from "@/components/ui/StarRating";
import { googleReviewsUrl, reviews } from "@/lib/data/reviews";

/**
 * No review, name or rating is invented — this renders only what's in
 * lib/data/reviews.ts, which is empty until real Google Reviews are
 * connected. The empty state is a real framed placeholder (an outline
 * star row + a quote mark) rather than a bare sentence, so the section
 * still reads as designed, not broken. The "Read our Google Reviews" CTA
 * only appears once a real review link exists, so it's never a dead
 * button.
 */
export function ReviewsSection() {
  return (
    <Section>
      <SectionHeading eyebrow="Google Reviews" title="What families are saying" align="center" />

      {reviews.length > 0 ? (
        <EditorialGrid className="mt-16">
          {reviews.map((review) => (
            <div key={review.id} className="col-span-12 sm:col-span-6 lg:col-span-4">
              <StarRating rating={review.rating} />
              <p className="mt-4 text-body-lg leading-relaxed text-charcoal/85">
                &ldquo;{review.text}&rdquo;
              </p>
              <p className="mt-4 text-small font-medium text-plum">— {review.reviewerName}</p>
            </div>
          ))}
        </EditorialGrid>
      ) : (
        <div className="mx-auto mt-12 max-w-lg border border-taupe/25 bg-white/60 px-8 py-12 text-center">
          <p aria-hidden className="font-display text-h1 leading-none text-blush">
            &ldquo;
          </p>
          <p className="-mt-4 text-body-lg text-charcoal/70">
            Real reviews from families we&apos;ve photographed will appear
            here once connected from Google.
          </p>
        </div>
      )}

      {googleReviewsUrl ? (
        <div className="mt-8 text-center">
          <Button href={googleReviewsUrl} variant="text">
            Read Our Google Reviews
          </Button>
        </div>
      ) : null}
    </Section>
  );
}
