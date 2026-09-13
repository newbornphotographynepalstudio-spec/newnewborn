import type { Metadata } from "next";

import { Cluster } from "@/components/primitives/Cluster";
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
 * Leads with the contact channels that work immediately with no backend
 * (tel:/wa.me/mailto: links), and points to the full enquiry form at
 * /book-a-session/ for anyone who'd rather send full session details in
 * one go.
 */
export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        description="Reach out directly, or send full session details through the booking form — whichever is easier."
      />

      <Section>
        <Stack gap="lg" className="max-w-md">
          <ContactRow label="Phone" value={contactInfo.phoneDisplay} href={`tel:${contactInfo.phoneE164}`} />
          <ContactRow label="WhatsApp" value={contactInfo.phoneDisplay} href={contactInfo.whatsappUrl} />
          <ContactRow label="Email" value={contactInfo.email} href={`mailto:${contactInfo.email}`} />
        </Stack>

        <Cluster gap="sm" className="mt-12">
          <Button href={routes.bookASession}>Book a Session</Button>
          <Button href={contactInfo.whatsappUrl} variant="secondary">
            Message on WhatsApp
          </Button>
        </Cluster>
      </Section>
    </>
  );
}
