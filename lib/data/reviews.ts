import type { Review } from "@/lib/reviews/types";

/**
 * No reviews yet — real Google Reviews will be connected in a later
 * phase. Do not add a placeholder/example review here; an empty array is
 * the honest state, and `ReviewsSection` renders a "coming soon" message
 * for it.
 */
export const reviews: Review[] = [];

/** Set once a real Google Business Profile review link exists. */
export const googleReviewsUrl: string | undefined = undefined;
