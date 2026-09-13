export type ExperienceStep = {
  number: string;
  title: string;
  description: string;
};

/** General, industry-standard description of the session journey — not a
 * claim specific to this studio's exact process. */
export const experienceSteps: ExperienceStep[] = [
  {
    number: "01",
    title: "Planning",
    description:
      "A conversation before your session to talk through timing, styling and anything on your mind.",
  },
  {
    number: "02",
    title: "The Session",
    description:
      "An unhurried, baby-led session in a warm, controlled studio environment.",
  },
  {
    number: "03",
    title: "Your Images",
    description:
      "A curated gallery of your favorite portraits, ready to view and choose from.",
  },
  {
    number: "04",
    title: "Albums & Artwork",
    description:
      "Premium albums, frames and prints to turn your favorite images into lasting keepsakes.",
  },
];
