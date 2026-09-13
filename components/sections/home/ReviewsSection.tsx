import { EditorialGrid } from "@/components/primitives/EditorialGrid";
import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StarRating } from "@/components/ui/StarRating";
import { googleReviewsUrl, reviews } from "@/lib/data/reviews";

/**
 * No review, name or rating is invented — this renders only what's in
 * `lib/data/reviews.ts`, which is empty until real Google Reviews are
 * connected in a later phase. The "Read our Google Reviews" CTA only
 * appears once a real review link exists, so it's never a dead button.
 */
export function ReviewsSection() {
  return (
    <Section tone="blush">
      <SectionHeading
        eyebrow="Google Reviews"
        title="What families are saying"
        align="center"
      />

      {reviews.length > 0 ? (
        <EditorialGrid className="mt-2xl">
          {reviews.map((review) => (
            <div key={review.id} className="col-span-12 sm:col-span-6 lg:col-span-4">
              <StarRating rating={review.rating} />
              <p className="mt-sm text-body-lg leading-relaxed text-charcoal/85">
                &ldquo;{review.text}&rdquo;
              </p>
              <p className="mt-sm text-small font-medium text-plum">
                — {review.reviewerName}
              </p>
            </div>
          ))}
        </EditorialGrid>
      ) : (
        <Reveal className="mx-auto mt-lg max-w-md text-center">
          <p className="text-small text-taupe">
            Google Reviews will be featured here once connected.
          </p>
        </Reveal>
      )}

      {googleReviewsUrl ? (
        <div className="mt-lg text-center">
          <Button href={googleReviewsUrl} variant="text">
            Read Our Google Reviews
          </Button>
        </div>
      ) : null}
    </Section>
  );
}
