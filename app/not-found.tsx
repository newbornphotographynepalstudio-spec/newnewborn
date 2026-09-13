import { Cluster } from "@/components/primitives/Cluster";
import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/ui/Button";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { bookASessionCta, routes } from "@/lib/navigation/routes";

/**
 * A truly unmatched route (no file anywhere in the route tree) renders
 * this file directly under the root layout — Next.js can't know which
 * nested (site)/(admin) layout would have applied, so it skips nested
 * layouts entirely for this case. Header/Footer/WhatsAppButton are
 * rendered explicitly here rather than relied on from `(site)/layout.tsx`
 * so the 404 still feels like part of the site, not a bare error screen.
 */
export default function NotFound() {
  return (
    <>
      <Header />
      <main>
        <Section className="text-center">
          <p className="text-eyebrow font-medium tracking-eyebrow text-taupe uppercase">
            404
          </p>
          <h1 className="mt-4 text-h1">Page not found</h1>
          <p className="mx-auto mt-4 max-w-prose text-body-lg leading-relaxed text-charcoal/80">
            The page you&apos;re looking for doesn&apos;t exist or may have
            moved.
          </p>
          <Cluster gap="sm" align="center" justify="center" className="mt-8">
            <Button href={routes.home}>Back to Home</Button>
            <Button href={routes.portfolio} variant="secondary">
              View Portfolio
            </Button>
            <Button href={bookASessionCta.href} variant="secondary">
              {bookASessionCta.label}
            </Button>
          </Cluster>
        </Section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
