import type { FaqItem } from "@/lib/faq/types";
import { homeFaqPreview } from "@/lib/data/faq-preview";

const moreFaqs: FaqItem[] = [
  {
    id: "reschedule",
    question: "Can we reschedule if our baby arrives early or late?",
    answer:
      "Yes. Newborn sessions are naturally flexible around your due date. Reach out as soon as you know your baby's arrival date so the session can be adjusted.",
  },
  {
    id: "home-sessions",
    question: "Do you offer home sessions?",
    answer:
      "Home sessions are available where offered. Mention this when you get in touch so it can be discussed for your location.",
  },
  {
    id: "session-length",
    question: "How long does a session take?",
    answer:
      "Newborn sessions generally take longer than other sessions, to allow time for feeding and settling. Exact timing is discussed when you book.",
  },
  {
    id: "delivery",
    question: "How do we receive our photos?",
    answer: "Edited images are shared through a private online gallery for you to view and choose from.",
  },
  {
    id: "albums",
    question: "Do you offer albums and prints?",
    answer:
      "Yes. Premium albums, frames and prints are available in addition to the digital gallery.",
  },
  {
    id: "booking-notice",
    question: "How far in advance should we book?",
    answer:
      "For newborn sessions, as early as possible during pregnancy. For other sessions, a few weeks' notice is usually enough.",
  },
  {
    id: "studio-location",
    question: "Where is the studio?",
    answer:
      "The studio is based in Kathmandu Valley, Nepal. Reach out through the Contact page for exact directions and the studio's Google Maps location.",
  },
  {
    id: "newborn-cost",
    question: "How much does newborn photography cost?",
    answer:
      "Newborn session pricing is published in full on the Packages & Pricing page, with three collections — Mini, Premium and Luxury — each showing exact NPR pricing and what's included.",
  },
];

export const fullFaqList: FaqItem[] = [...homeFaqPreview, ...moreFaqs];
