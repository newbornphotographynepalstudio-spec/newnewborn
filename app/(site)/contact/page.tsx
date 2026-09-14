import type { Metadata } from "next";

import { Cluster } from "@/components/primitives/Cluster";
import { Section } from "@/components/primitives/Section";
import { Stack } from "@/components/primitives/Stack";
import { Button } from "@/components/ui/Button";
import { ContactRow } from "@/components/ui/ContactRow";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { contactInfo } from "@/lib/data/contact";
import { cakeSmashGallery } from "@/lib/media/cake-smash-gallery";
import { routes } from "@/lib/navigation/routes";

/** A real, warm session photo not used anywhere outside the full
 * portfolio grid — fills what was a large empty right-hand column at
 * wide viewports (the contact block alone is only max-w-md) with real
 * photography instead of dead space. */
const contactPhoto = cakeSmashGallery.find((img) => img.id === "cakesmash-messy-smile")!;

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
        description="Reach out directly, or send full session details through the booking form, whichever is easier."
      />

      <Section>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6 lg:self-center">
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
          </div>
          <div className="lg:col-span-6">
            <Reveal>
              <EditorialImage
                src={contactPhoto.src}
                alt={contactPhoto.alt}
                aspect="portrait"
                sizes="(min-width: 1024px) 45vw, 100vw"
                rounded
              />
            </Reveal>
          </div>
        </div>
      </Section>
    </>
  );
}
