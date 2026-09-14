import { Section } from "@/components/primitives/Section";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Reveal } from "@/components/ui/Reveal";
import { newbornGallery } from "@/lib/media/newborn-gallery";

const heritagePhoto = newbornGallery.find((img) => img.id === "newborn-family-heritage")!;

/**
 * Now uses the real three-generation family portrait from an actual
 * session (see lib/media/newborn-gallery.ts) rather than staying
 * text-only — this is a genuinely different photograph from the hero, so
 * showing it here isn't repetition.
 */
export function HeritageSection() {
  return (
    <Section tone="plum">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <EditorialImage
              src={heritagePhoto.src}
              alt={heritagePhoto.alt}
              aspect={heritagePhoto.desktopAspect}
              mobileAspect={heritagePhoto.mobileAspect}
              position={heritagePhoto.objectPosition}
              sizes="(min-width: 1024px) 41vw, 100vw"
              rounded
            />
          </Reveal>
        </div>
        <div className="lg:col-span-7">
          <Reveal delay={75}>
            <p className="text-eyebrow font-medium tracking-eyebrow text-blush uppercase">
              Heritage
            </p>
            <h2 className="mt-3 text-display text-white">
              Your baby&apos;s story begins with family.
            </h2>
            <p className="mt-6 max-w-prose text-body-lg leading-relaxed text-white/80">
              Nepali families carry generations of tradition into how they
              welcome a newborn. This studio&apos;s newborn sessions make room
              for that heritage: styling, keepsakes and quiet family
              moments, alongside timeless portraiture.
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
