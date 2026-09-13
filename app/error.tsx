"use client";

import { useEffect } from "react";

import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/ui/Button";

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
    <Section className="text-center">
      <p className="text-eyebrow font-medium tracking-eyebrow text-taupe uppercase">
        Error
      </p>
      <h1 className="mt-4 text-h1">Something went wrong</h1>
      <p className="mx-auto mt-4 max-w-prose text-body-lg leading-relaxed text-charcoal/80">
        Please try again. If the problem continues, please contact us
        directly.
      </p>
      <Button type="button" onClick={reset} className="mt-8">
        Try again
      </Button>
    </Section>
  );
}
