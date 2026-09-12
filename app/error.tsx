"use client";

import { useEffect } from "react";

import { Container } from "@/components/ui/Container";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="py-24 text-center sm:py-32">
      <p className="text-sm font-medium tracking-wide text-ink-soft uppercase">
        Error
      </p>
      <h1 className="mt-3 text-4xl text-ink sm:text-5xl">
        Something went wrong
      </h1>
      <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-charcoal/80">
        Please try again. If the problem continues, please contact us
        directly.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 inline-block rounded-sm bg-ink px-6 py-3 text-sm text-cream transition-colors hover:bg-ink-soft"
      >
        Try again
      </button>
    </Container>
  );
}
