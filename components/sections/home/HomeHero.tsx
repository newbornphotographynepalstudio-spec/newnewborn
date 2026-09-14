import { Cluster } from "@/components/primitives/Cluster";
import { Container } from "@/components/primitives/Container";
import { Button } from "@/components/ui/Button";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { contactInfo } from "@/lib/data/contact";
import { cultureHeritageImage } from "@/lib/media/approved-assets";
import { bookASessionCta } from "@/lib/navigation/routes";

/**
 * The homepage's primary visual anchor (culture1.jpg) — full-bleed,
 * priority-loaded (near-certain LCP element). Composition follows the
 * "full image + gradient only where text needs it" pattern: the scrim is
 * a separate absolutely-positioned layer covering only the bottom ~2/3 of
 * the frame, so the baby and the brass/textile styling in the upper
 * portion of the photograph stay completely uncovered — the photography
 * remains dominant, text sits in the negative space beneath it.
 *
 * Art direction: wide (16:9) on desktop, portrait (4:5) on mobile — from
 * the one unaltered source image, via EditorialImage's mobileAspect.
 *
 * The text block's size/spacing is deliberately smaller below `sm`
 * (compact eyebrow, h3-sized H1, tighter padding, smaller supporting
 * copy and buttons) rather than one fluid scale all the way down —
 * measured the previous
 * single-scale version actually overlapping the baby's face at 390px: the
 * text block's natural height (~600px+) exceeded the entire portrait
 * image's height (487px), so it started almost at the image's top edge
 * instead of sitting in the "negative space beneath" the subject the
 * design is supposed to rely on. This keeps the whole text block inside
 * the bottom ~55% of the image at narrow widths, matching the gradient's
 * own coverage, so the baby's face stays genuinely clear.
 */
export function HomeHero() {
  return (
    <section className="relative">
      <EditorialImage
        src={cultureHeritageImage.src}
        alt={cultureHeritageImage.alt}
        aspect="wide"
        mobileAspect="portrait"
        priority
        sizes="100vw"
        className="w-full"
        overlay={
          <>
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0">
              <Container size="wide" className="pt-6 pb-6 sm:pt-16 sm:pb-10 lg:pt-24 lg:pb-24">
                <p className="text-caption sm:text-eyebrow font-medium tracking-eyebrow text-blush uppercase">
                  Newborn Photography
                </p>
                <h1 className="mt-2 max-w-2xl text-h3 sm:mt-3 sm:text-h1 text-white">
                  Newborn Photography in Kathmandu, Nepal
                </h1>
                <p className="mt-2 max-w-xl text-small sm:mt-4 sm:text-body-lg leading-relaxed text-white/85">
                  Editorial newborn portraits in a calm, safety-led studio
                  in Kathmandu, unrushed sessions planned around your
                  baby&apos;s comfort, not a fixed shot list.
                </p>
                <Cluster gap="sm" className="mt-4 sm:mt-8">
                  <Button href={bookASessionCta.href} size="sm">
                    {bookASessionCta.label}
                  </Button>
                  <Button
                    href={contactInfo.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="secondary"
                    size="sm"
                    className="!border-white/50 !text-white hover:!border-white hover:!bg-white/10"
                  >
                    WhatsApp
                  </Button>
                </Cluster>
              </Container>
            </div>
          </>
        }
      />
    </section>
  );
}
