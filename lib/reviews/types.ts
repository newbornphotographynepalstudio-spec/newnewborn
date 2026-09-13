/**
 * Typed contract for a customer review — built so real Google Reviews can
 * populate it in a later phase (via the Google Business Profile API or a
 * manually-entered admin screen). No review, name or rating is invented
 * anywhere this type is used; an empty `reviews` array is the correct
 * state until real reviews are connected.
 */
export type Review = {
  id: string;
  reviewerName: string;
  reviewerProfileImage?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  date: string;
  source: "google" | "manual";
  /** Link to the review on its original platform, if legitimately available. */
  sourceUrl?: string;
};
