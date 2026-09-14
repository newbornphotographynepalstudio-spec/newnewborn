import "server-only";

import { googleReviewsUrl } from "@/lib/data/reviews";
import type { Review } from "@/lib/reviews/types";

export type LiveReviewsResult = {
  reviews: Review[];
  /** Google's own place rating (0-5, one decimal), if returned. */
  rating: number;
  /** Google's own total review count for the place — note this is the
   * *total* count, which is almost always larger than `reviews.length`:
   * the API returns at most 5 reviews per request, chosen by Google, not
   * the full set. Never present `reviews.length` as the review count. */
  userRatingCount: number;
};

/**
 * Fetches real reviews from the Google Places API (New) — Place Details
 * endpoint, if (and only if) it's configured. Returns `null` — not an
 * empty result — when unconfigured or on any failure; callers must treat
 * `null` as "no live data available" and fall back to the honest static
 * empty state in lib/data/reviews.ts, never as "confirmed zero reviews."
 *
 * Requires two server-only environment variables (see docs/SETUP.md,
 * "Google Reviews" — neither is set in this environment, so this code
 * path is unexercised/unverified here, and every page that calls this
 * degrades to the existing honest empty state exactly as before):
 *
 *   GOOGLE_PLACES_API_KEY  — an API key restricted to Places API (New),
 *     kept server-only (no NEXT_PUBLIC_ prefix — never sent to the browser)
 *   GOOGLE_PLACES_PLACE_ID — this business's Google Place ID
 *
 * Google's Place Details response returns at most 5 reviews, chosen by
 * Google (not filterable/sortable by this code), and billing must be
 * enabled on the Google Cloud project even though real-world request
 * volume here — cached 24h via Next's fetch revalidation — should stay
 * well inside the free monthly allowance.
 */
export async function fetchGoogleReviews(): Promise<LiveReviewsResult | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACES_PLACE_ID;
  if (!apiKey || !placeId) {
    return null;
  }

  let response: Response;
  try {
    response = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "reviews,rating,userRatingCount",
      },
      // Reviews don't need to be real-time fresh — a day-old cache keeps
      // request volume (and cost) minimal while staying reasonably current.
      next: { revalidate: 86400 },
    });
  } catch (error) {
    console.error("fetchGoogleReviews: network error:", error);
    return null;
  }

  if (!response.ok) {
    console.error("fetchGoogleReviews: Places API request failed:", response.status, await response.text().catch(() => ""));
    return null;
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch (error) {
    console.error("fetchGoogleReviews: could not parse response:", error);
    return null;
  }

  const payload = data as {
    reviews?: unknown[];
    rating?: number;
    userRatingCount?: number;
  };

  const rawReviews = Array.isArray(payload.reviews) ? payload.reviews : [];

  const reviews: Review[] = rawReviews
    .map((raw, index): Review | null => {
      const r = raw as {
        rating?: number;
        text?: { text?: string };
        originalText?: { text?: string };
        authorAttribution?: { displayName?: string; photoUri?: string };
        publishTime?: string;
      };
      const text = r.originalText?.text ?? r.text?.text;
      const name = r.authorAttribution?.displayName;
      const rating = r.rating;
      if (!text || !name || typeof rating !== "number") return null;

      return {
        id: `google-${r.publishTime ?? index}`,
        reviewerName: name,
        reviewerProfileImage: r.authorAttribution?.photoUri,
        rating: Math.round(Math.min(5, Math.max(1, rating))) as 1 | 2 | 3 | 4 | 5,
        text,
        date: r.publishTime ?? "",
        source: "google",
        sourceUrl: googleReviewsUrl,
      };
    })
    .filter((r): r is Review => r !== null);

  return {
    reviews,
    rating: typeof payload.rating === "number" ? payload.rating : 0,
    userRatingCount: typeof payload.userRatingCount === "number" ? payload.userRatingCount : 0,
  };
}
