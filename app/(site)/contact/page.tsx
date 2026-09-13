import type { Metadata } from "next";

import { Section } from "@/components/primitives/Section";
import { Stack } from "@/components/primitives/Stack";
import { Button } from "@/components/ui/Button";
import { ContactRow } from "@/components/ui/ContactRow";
import { PageHero } from "@/components/ui/PageHero";
import { contactInfo } from "@/lib/data/contact";
import { routes } from "@/lib/navigation/routes";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Newborn Photography Nepal by phone, WhatsApp or email to ask about availability, pricing or your session.",
  alternates: { canonical: routes.contact },
};

/**
 * A booking/inquiry web form needs a server to receive it — that's later
 * phase work (see docs/ARCHITECTURE.md). Rather than ship a form that
 * silently goes nowhere, this page leads with the contact channels that
 * already work today: phone, WhatsApp and email.
 */
export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        description="The fastest way to reach us is by phone, WhatsApp or email — for a structured booking request, use Book a Session instead."
      />

      <Section>
        <Stack gap="lg" className="max-w-md">
          <ContactRow label="Phone" value={contactInfo.phoneDisplay} href={`tel:${contactInfo.phoneE164}`} />
          <ContactRow label="WhatsApp" value={contactInfo.phoneDisplay} href={contactInfo.whatsappUrl} />
          <ContactRow label="Email" value={contactInfo.email} href={`mailto:${contactInfo.email}`} />
        </Stack>

        <div className="mt-12">
          <Button href={routes.bookASession} variant="text">
            Or Start a Booking Request
          </Button>
        </div>
      </Section>
    </>
  );
}
