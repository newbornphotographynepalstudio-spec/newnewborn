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
      "Newborn sessions range from about 1 to 4 hours depending on the package: 1 hour for the Mini session, 2 hours for Premium, and 3 to 4 hours for the Luxury package.",
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
  {
    id: "who-photographs",
    question: "Who photographs the sessions?",
    answer:
      "Every session — newborn, maternity, baby, cake smash and family photography — is photographed by Navin, based in Kathmandu.",
  },
];

export const fullFaqList: FaqItem[] = [...homeFaqPreview, ...moreFaqs];
