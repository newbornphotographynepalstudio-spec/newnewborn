import type { Review } from "@/lib/reviews/types";

/**
 * No reviews yet — this is the studio's real Google Business Profile
 * review link (client-supplied, not a placeholder), but no actual review
 * text/names/ratings have been supplied to this codebase to display.
 * Do not add a placeholder/example review here; an empty array is the
 * honest state. `ReviewsSection` renders a confident redirect to the
 * real reviews on Google rather than an apologetic "coming soon" for it.
 */
export const reviews: Review[] = [];

/** The studio's real Google Business Profile review link. */
export const googleReviewsUrl = "https://g.page/r/CQVMlzKA1Cv7EAE/review";
