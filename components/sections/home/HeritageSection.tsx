import { Section } from "@/components/primitives/Section";

/**
 * The hero photograph already carries this section's cultural storytelling
 * (traditional Nepali newborn styling, brass heirlooms, hand-woven
 * textiles) — repeating the same source image again this far down the
 * same page would read as thin rather than intentional, so this stays a
 * short editorial statement. A dedicated heritage photograph can replace/
 * accompany this text once additional approved assets exist.
 */
export function HeritageSection() {
  return (
    <Section tone="plum" compact>
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-eyebrow font-medium tracking-eyebrow text-blush uppercase">
          Heritage
        </p>
        <h2 className="mt-3 text-display text-white">
          Your baby&apos;s story begins with family.
        </h2>
        <p className="mx-auto mt-6 max-w-prose text-body-lg leading-relaxed text-white/80">
          Nepali families carry generations of tradition into how they
          welcome a newborn. This studio&apos;s newborn sessions make room for
          that heritage — styling, keepsakes and quiet family moments —
          alongside timeless portraiture.
        </p>
      </div>
    </Section>
  );
}
