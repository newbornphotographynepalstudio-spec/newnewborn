import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { routes } from "@/lib/navigation/routes";

export default function NotFound() {
  return (
    <Container className="py-24 text-center sm:py-32">
      <p className="text-sm font-medium tracking-wide text-ink-soft uppercase">
        404
      </p>
      <h1 className="mt-3 text-4xl text-ink sm:text-5xl">Page not found</h1>
      <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-charcoal/80">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link
        href={routes.home}
        className="mt-8 inline-block rounded-sm bg-ink px-6 py-3 text-sm text-cream transition-colors hover:bg-ink-soft"
      >
        Back to Home
      </Link>
    </Container>
  );
}
