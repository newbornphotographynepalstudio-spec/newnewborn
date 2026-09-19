import type { FaqItem } from "@/lib/faq/types";

/**
 * A short, homepage-appropriate selection. Answers are general,
 * industry-standard guidance, not specific claims about this studio's
 * exact policies, pricing or inclusions. The full set lives on /faq/.
 */
export const homeFaqPreview: FaqItem[] = [
  {
    id: "when-to-book",
    question: "When should we book a newborn session?",
    answer:
      "Newborn sessions are best booked during pregnancy, so a date can be reserved for the first couple of weeks after birth.",
  },
  {
    id: "what-to-bring",
    question: "What should we bring?",
    answer:
      "Bring your baby, and let us know in advance about any outfits, wraps or keepsakes you'd like included.",
  },
  {
    id: "is-it-safe",
    question: "Are newborn sessions safe?",
    answer:
      "Yes. Every pose is baby-led and gently supported, in a calm, controlled studio setting.",
  },
  {
    id: "other-sessions",
    question: "Do you offer maternity and family photography?",
    answer:
      "Yes. Alongside newborn photography, maternity, baby, cake smash and family sessions are all offered.",
  },
  {
    id: "booking-notice",
    question: "How far in advance should we book?",
    answer:
      "For newborn sessions, as early as possible during pregnancy. For other sessions, a few weeks' notice is usually enough.",
  },
];
