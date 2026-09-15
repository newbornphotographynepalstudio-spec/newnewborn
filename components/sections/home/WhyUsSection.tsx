import { SplitSection } from "@/components/primitives/SplitSection";
import { Reveal } from "@/components/ui/Reveal";
import { newbornGallery } from "@/lib/media/newborn-gallery";

const photo = newbornGallery.find((img) => img.id === "newborn-yellow-wrap")!;

/**
 * "Why Newborn Photography Nepal" — a differentiation section built
 * entirely from facts already established elsewhere in this codebase
 * (Safety page's real principles, Studio page's real features,
 * HeritageSection's real Nepali-family positioning, and the real,
 * transparent NPR pricing on the Packages page). No credentials, years
 * of experience, client counts, or awards are claimed here — none of
 * that has been supplied, so none of it appears. This intentionally
 * replaces a "Meet Navin" personal-bio section: no real photographer
 * name/bio/portrait has been supplied yet (OWNER CONTENT REQUIRED — see
 * docs/SETUP.md), so this section carries the homepage's early-trust
 * role honestly instead of inventing a personal story.
 */
const pillars = [
  {
    title: "A newborn specialty, not a side offering",
    description:
      "This studio grew out of a focus on one kind of session: newborns in the first days and weeks of life. Maternity, baby, cake smash and family sessions sit alongside that core focus.",
  },
  {
    title: "Safety built into every session",
    description:
      "Baby-led posing, trained and careful handling, and a controlled, warm studio environment — not an afterthought, but how every session is planned from the start.",
  },
  {
    title: "A private, controlled studio",
    description:
      "One family at a time, no waiting room, consistent lighting and a room kept warm specifically for newborn comfort.",
  },
  {
    title: "Nepali family heritage, welcomed in",
    description:
      "Sessions make room for the traditions Nepali families bring into welcoming a newborn: styling, keepsakes and quiet family moments alongside the portraits.",
  },
  {
    title: "Transparent packages, real pricing",
    description:
      "Three clear packages with exact pricing and exact inclusions, published upfront, so you know what you're choosing between before you ever reach out.",
  },
];

export function WhyUsSection() {
  return (
    <SplitSection image={photo.src} imageAlt={photo.alt} imageAspect="portrait" imageSide="left" tone="ivory">
      <Reveal>
        <p className="text-eyebrow font-medium tracking-eyebrow text-taupe uppercase">
          Why Newborn Photography Nepal
        </p>
        <h2 className="mt-3 text-h2">What actually sets a session here apart</h2>
      </Reveal>
      <div className="mt-8 space-y-6">
        {pillars.map((pillar, index) => (
          <Reveal key={pillar.title} delay={index * 60}>
            <div className="border-b border-taupe/20 pb-6 last:border-b-0 last:pb-0">
              <h3 className="text-h4 text-plum">{pillar.title}</h3>
              <p className="mt-2 text-body leading-relaxed text-charcoal/80">{pillar.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </SplitSection>
  );
}
