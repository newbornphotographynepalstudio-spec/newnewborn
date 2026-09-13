function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.25"
      aria-hidden
    >
      <path
        d="M10 1.6l2.47 5.28 5.72.6-4.27 3.93 1.15 5.65L10 14.9l-5.07 2.16 1.15-5.65L1.81 7.48l5.72-.6L10 1.6z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StarRating({ rating }: { rating: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <div role="img" aria-label={`${rating} out of 5 stars`} className="flex gap-1 text-plum">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} filled={n <= rating} />
      ))}
    </div>
  );
}
