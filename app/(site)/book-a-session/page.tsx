import type { Metadata } from "next";

import { Section } from "@/components/primitives/Section";
import { Stack } from "@/components/primitives/Stack";
import { Cluster } from "@/components/primitives/Cluster";
import { Button } from "@/components/ui/Button";
import { ContactRow } from "@/components/ui/ContactRow";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { contactInfo } from "@/lib/data/contact";
import { servicesNav } from "@/lib/navigation/routes";
import { routes } from "@/lib/navigation/routes";

export const metadata: Metadata = {
  title: "Book a Session",
  description:
    "How to book a newborn, maternity, baby, cake smash or family photography session with Newborn Photography Nepal.",
  alternates: { canonical: routes.bookASession },
};

const steps = [
  {
    number: "01",
    title: "Reach out",
    description: "Message on WhatsApp, call, or email with the type of session and your rough timing.",
  },
  {
    number: "02",
    title: "Confirm the date",
    description:
      "For newborn sessions, this usually happens during pregnancy so a date is held for after birth.",
  },
  {
    number: "03",
    title: "Get session details",
    description: "You'll receive what to bring and how to prepare ahead of your actual session.",
  },
];

export default function BookASessionPage() {
  return (
    <>
      <PageHero
        eyebrow="Book a Session"
        title="Booking is a conversation, not a form"
        description="There's no online checkout for this — booking starts with a message. Here's how it works."
      />

      <Section>
        <SectionHeading eyebrow="How It Works" title="Three steps to a booked session" />
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number}>
              <p className="font-display text-h2 text-rose">{step.number}</p>
              <h3 className="mt-2 text-h4 text-plum">{step.title}</h3>
              <p className="mt-2 text-small leading-relaxed text-charcoal/75">{step.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="blush">
        <SectionHeading eyebrow="Start Here" title="Reach out directly" />
        <Stack gap="lg" className="mt-10 max-w-md">
          <ContactRow label="WhatsApp" value={contactInfo.phoneDisplay} href={contactInfo.whatsappUrl} />
          <ContactRow label="Phone" value={contactInfo.phoneDisplay} href={`tel:${contactInfo.phoneE164}`} />
          <ContactRow label="Email" value={contactInfo.email} href={`mailto:${contactInfo.email}`} />
        </Stack>
      </Section>

      <Section compact>
        <p className="text-eyebrow font-medium tracking-eyebrow text-taupe uppercase">
          Which Session?
        </p>
        <Cluster gap="md" className="mt-4">
          {servicesNav.map((service) => (
            <Button key={service.href} href={service.href} variant="secondary" size="sm">
              {service.label} Photography
            </Button>
          ))}
        </Cluster>
      </Section>
    </>
  );
}
