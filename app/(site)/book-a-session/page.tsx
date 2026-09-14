import type { Metadata } from "next";

import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Stack } from "@/components/primitives/Stack";
import { BookingForm } from "@/components/sections/booking/BookingForm";
import { ContactRow } from "@/components/ui/ContactRow";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Reveal } from "@/components/ui/Reveal";
import { contactInfo } from "@/lib/data/contact";
import { cakeSmashGallery } from "@/lib/media/cake-smash-gallery";
import { SESSION_TYPES, type SessionType } from "@/lib/inquiries/types";
import { routes } from "@/lib/navigation/routes";

/** A real session photo, not used anywhere outside the full portfolio
 * grid — the intro column here is naturally much shorter than the long
 * form beside it, which otherwise leaves a large empty area below the
 * WhatsApp block at wide viewports. */
const bookingPhoto = cakeSmashGallery.find((img) => img.id === "cakesmash-balloon-portrait")!;

export const metadata: Metadata = {
  title: "Book a Session",
  description:
    "Book a newborn, maternity, baby, cake smash, family or training enquiry with Newborn Photography Nepal. Send your details and we'll be in touch.",
  alternates: { canonical: routes.bookASession },
};

export default async function BookASessionPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; package?: string }>;
}) {
  const { type, package: packageParam } = await searchParams;
  const defaultSessionType = SESSION_TYPES.includes(type as SessionType)
    ? (type as SessionType)
    : undefined;

  return (
    <Section>
      <Container size="wide">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p className="text-eyebrow font-medium tracking-eyebrow text-taupe uppercase">
              Book a Session
            </p>
            <h1 className="mt-3 text-h1">Tell us about your session</h1>
            <p className="mt-5 max-w-prose text-body-lg leading-relaxed text-charcoal/80">
              Send your details below and we&apos;ll get back to you
              directly to confirm availability, current pricing and
              anything else you&apos;d like to know. This isn&apos;t an
              instant booking. It starts a conversation with the studio.
            </p>
            <p className="mt-5 max-w-prose text-body leading-relaxed text-charcoal/75">
              Newborn sessions are best enquired about during pregnancy,
              so a date can be held for after birth. For every other
              session, a few weeks&apos; notice is usually enough.
            </p>

            <div className="mt-10 border-t border-taupe/20 pt-8">
              <p className="text-caption tracking-eyebrow text-taupe uppercase">
                Prefer WhatsApp?
              </p>
              <Stack gap="md" className="mt-4 max-w-xs">
                <ContactRow
                  label="WhatsApp"
                  value={contactInfo.phoneDisplay}
                  href={contactInfo.whatsappUrl}
                />
              </Stack>
            </div>

            <div className="mt-10 max-w-xs">
              <Reveal>
                <EditorialImage
                  src={bookingPhoto.src}
                  alt={bookingPhoto.alt}
                  aspect="portrait"
                  sizes="(min-width: 1024px) 20vw, 60vw"
                  rounded
                />
              </Reveal>
            </div>
          </div>

          <div className="lg:col-span-7">
            <BookingForm defaultSessionType={defaultSessionType} defaultPackage={packageParam} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
