import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/ui/Button";
import { routes } from "@/lib/navigation/routes";

export default function NotFound() {
  return (
    <Section className="text-center">
      <p className="text-eyebrow font-medium tracking-eyebrow text-taupe uppercase">
        404
      </p>
      <h1 className="mt-sm text-h1">Page not found</h1>
      <p className="mx-auto mt-sm max-w-prose text-body-lg leading-relaxed text-charcoal/80">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Button href={routes.home} className="mt-lg">
        Back to Home
      </Button>
    </Section>
  );
}
