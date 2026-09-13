import type { ImageProps } from "next/image";

import type { FaqItem } from "@/lib/faq/types";
import { routes } from "@/lib/navigation/routes";

export type ServiceSlug = "newborn" | "maternity" | "baby" | "cake-smash" | "family";

export type ServicePageContent = {
  slug: ServiceSlug;
  name: string;
  href: string;
  metaTitle: string;
  metaDescription: string;
  heroEyebrow: string;
  h1: string;
  heroDescription: string;
  introHeading: string;
  introParagraphs: string[];
  includes: string[];
  whyChoose: string[];
  showcaseImage?: ImageProps["src"];
  showcaseAlt?: string;
  faqs: FaqItem[];
  relatedSlugs: ServiceSlug[];
};

/**
 * Real, specific copy per service — not interchangeable placeholder text.
 * `showcaseImage` is only set for newborn (the one approved,
 * category-matching photograph); every other page's showcase section
 * renders an honest placeholder instead of a stand-in photo.
 */
export function getServicePages(
  cultureImage: ImageProps["src"],
  cultureAlt: string
): Record<ServiceSlug, ServicePageContent> {
  return {
    newborn: {
      slug: "newborn",
      name: "Newborn",
      href: routes.newborn,
      metaTitle: "Newborn Photography Sessions in Kathmandu, Nepal",
      metaDescription:
        "Newborn photography sessions in Kathmandu, Nepal — a calm, safety-led studio session for your baby's first two weeks. See what's included and how sessions are planned.",
      heroEyebrow: "Newborn Photography",
      h1: "Newborn Photography Sessions in Kathmandu, Nepal",
      heroDescription:
        "Portraits of your baby's earliest days, photographed gently in a warm, controlled studio in Kathmandu.",
      introHeading: "For the days that pass the fastest",
      introParagraphs: [
        "Newborns change by the week — the way they sleep, the size of their hands, the sounds they make before they can smile. A newborn session is timed to catch that specific, short window, usually within the first two weeks.",
        "Every session moves at the baby's pace. There's no rush and no forced poses — just enough time in a warm room for your baby to settle, so the small details come through in the photographs.",
      ],
      includes: [
        "A private studio session, timed around your baby's feeding and sleep",
        "Simple wraps, hats and set-ups suited to a newborn — nothing overdone",
        "Time built in for feeding, soothing and breaks",
        "A curated gallery of edited images to choose from afterward",
      ],
      whyChoose: [
        "Sessions are baby-led — the pace slows down or pauses whenever your baby needs it",
        "A calm, warm studio kept comfortable for newborn skin",
        "Careful, practiced handling throughout every pose",
        "Parents are present and involved for the whole session",
      ],
      showcaseImage: cultureImage,
      showcaseAlt: cultureAlt,
      faqs: [
        {
          id: "newborn-age",
          question: "How old should my baby be for a newborn session?",
          answer:
            "Most newborn sessions happen within the first one to two weeks, while babies are still small and sleep easily. Sessions after that are still possible — they just photograph a little differently.",
        },
        {
          id: "newborn-crying",
          question: "What if my baby cries or won't settle?",
          answer:
            "It's expected, and the session is planned around it. Feeding and soothing breaks are built in, with no fixed schedule to rush through.",
        },
        {
          id: "newborn-medical",
          question: "Do you photograph babies with medical concerns?",
          answer:
            "Every baby is different — reach out before booking so the session can be planned around what's right for your baby.",
        },
      ],
      relatedSlugs: ["maternity", "family"],
    },
    maternity: {
      slug: "maternity",
      name: "Maternity",
      href: routes.maternity,
      metaTitle: "Maternity Photography in Kathmandu Valley",
      metaDescription:
        "Maternity photography in Kathmandu Valley, Nepal — studio portraits for the last weeks of pregnancy, with options to include your partner or family.",
      heroEyebrow: "Maternity Photography",
      h1: "Maternity Photography in Kathmandu Valley",
      heroDescription: "Portraits of the last weeks of pregnancy, before your life changes.",
      introHeading: "One last portrait before three becomes more",
      introParagraphs: [
        "Maternity sessions are usually booked between the twenty-eighth and thirty-fifth week — late enough to show, early enough to still be comfortable standing through a session.",
        "Some parents want portraits of just the bump; others bring a partner, an older sibling, or grandparents. The session is shaped around what your family actually wants, not a fixed formula.",
      ],
      includes: [
        "A studio session timed to fit comfortably into your third trimester",
        "Options to include a partner, siblings or extended family",
        "Simple styling guidance beforehand, so you know what to bring",
        "A private viewing and edited gallery afterward",
      ],
      whyChoose: [
        "Posing that works with a late-pregnancy body, not against it",
        "A relaxed pace, with seating and breaks built in",
        "A studio environment that's comfortable rather than clinical",
        "The same studio you can return to for newborn and baby sessions later",
      ],
      faqs: [
        {
          id: "maternity-timing",
          question: "When should we book a maternity session?",
          answer:
            "Most sessions happen between weeks 28 and 35 — late enough to show clearly, early enough to still be comfortable for a longer session.",
        },
        {
          id: "maternity-partner",
          question: "Can my partner or other children be included?",
          answer: "Yes — let us know when booking and the session can be planned to include them.",
        },
        {
          id: "maternity-outfit",
          question: "What should I wear?",
          answer:
            "Simple, well-fitting clothing works best. Styling guidance is shared ahead of your session.",
        },
      ],
      relatedSlugs: ["newborn", "family"],
    },
    baby: {
      slug: "baby",
      name: "Baby",
      href: routes.baby,
      metaTitle: "Baby Photography in Kathmandu, Nepal",
      metaDescription:
        "Baby photography in Kathmandu, Nepal — studio sessions for your baby's first year, from sitting up to their first birthday.",
      heroEyebrow: "Baby Photography",
      h1: "Baby Photography in Kathmandu, Nepal",
      heroDescription:
        "Portraits that follow your baby's first year — sitting up, crawling, and the personality that comes with it.",
      introHeading: "The stage after newborn, before you know it",
      introParagraphs: [
        "Somewhere between three and twelve months, babies start reaching, sitting and reacting to the world in ways a newborn can't yet. A baby session is built around wherever your baby is in that stretch — sitting confidently, pulling up, or just starting to crawl.",
        "These sessions tend to be more playful than a newborn session, with more movement and more chance to photograph your baby actually looking like themselves.",
      ],
      includes: [
        "A studio session timed around your baby's age and mood",
        "Time for both calm portraits and more playful moments",
        "Simple, seasonally-appropriate styling",
        "An edited gallery ready to view after the session",
      ],
      whyChoose: [
        "Sessions built around nap and feeding schedules, not against them",
        "A patient pace — babies at this age move on their own timeline",
        "A studio your baby may already know from a newborn session",
        "Photography that favors real expressions over forced smiles",
      ],
      faqs: [
        {
          id: "baby-age",
          question: "What's the best age for a baby photography session?",
          answer:
            "Anywhere from three to twelve months works — sitting-up sessions (around six to eight months) and first-birthday sessions are both popular.",
        },
        {
          id: "baby-movement",
          question: "What if my baby won't stay still?",
          answer:
            "That's normal at this age, and the session is planned around it — playful, moving shots are part of what makes a baby session different from a newborn one.",
        },
        {
          id: "baby-cake-smash",
          question: "Can we combine this with a cake smash session?",
          answer: "Yes — many families book a baby and cake smash session together around the first birthday.",
        },
      ],
      relatedSlugs: ["cake-smash", "family"],
    },
    "cake-smash": {
      slug: "cake-smash",
      name: "Cake Smash",
      href: routes.cakeSmash,
      metaTitle: "Cake Smash Photography in Kathmandu",
      metaDescription:
        "Cake smash photography in Kathmandu, Nepal — a playful first-birthday studio session, photographed as it actually happens.",
      heroEyebrow: "Cake Smash Photography",
      h1: "Cake Smash Photography in Kathmandu",
      heroDescription: "A playful studio session to mark your baby's first birthday.",
      introHeading: "One cake, a lot of personality",
      introParagraphs: [
        "A cake smash session is less posed and more reactive — most of the best photographs happen in the moments your baby isn't expecting, whether that's total delight or complete suspicion of the cake in front of them.",
        "The set-up is simple by design: a backdrop, a cake, and enough room for your baby to make a mess of it. What happens next is really up to them.",
      ],
      includes: [
        "A themed or simple backdrop set-up, agreed on beforehand",
        "Time before the smash for a few clean, dressed-up portraits",
        "The cake smash itself, photographed as it actually happens",
        "An edited gallery covering both the tidy and the messy moments",
      ],
      whyChoose: [
        "A studio set-up built specifically for this kind of session",
        "Photography that keeps up with a fast-moving one-year-old",
        "No pressure for your baby to perform — genuine reactions are the point",
        "Easy to pair with a baby or family session on the same day",
      ],
      faqs: [
        {
          id: "cake-smash-cake",
          question: "What cake should we bring?",
          answer:
            "A small, simple cake works best — it's easier for your baby to interact with and easier to keep the set-up clean between shots.",
        },
        {
          id: "cake-smash-uninterested",
          question: "What if my baby doesn't want to touch the cake?",
          answer:
            "That happens, and it's still a good session — some of the most memorable photos are babies being unimpressed by cake.",
        },
        {
          id: "cake-smash-outfit",
          question: "Can we bring an outfit change?",
          answer:
            "Yes — most families bring one outfit for before the smash and don't mind the mess for the smash itself.",
        },
      ],
      relatedSlugs: ["baby", "family"],
    },
    family: {
      slug: "family",
      name: "Family",
      href: routes.family,
      metaTitle: "Family Photography in Kathmandu, Nepal",
      metaDescription:
        "Family photography in Kathmandu, Nepal — studio portraits sized to fit your family, from new babies to multiple generations.",
      heroEyebrow: "Family Photography",
      h1: "Family Photography in Kathmandu, Nepal",
      heroDescription: "Portraits that bring your family together in one set of images.",
      introHeading: "Everyone in the same frame, for once",
      introParagraphs: [
        "Family sessions work for a lot of occasions — a new baby joining the family, grandparents visiting, or simply wanting a current portrait when the last one is a few years old.",
        "The session is planned around your family as it actually is, including however many generations, siblings or pets are part of the picture.",
      ],
      includes: [
        "A studio session sized to fit your family, however many people that is",
        "Guidance on coordinating outfits beforehand",
        "A mix of posed group portraits and more natural, candid moments",
        "An edited gallery to view and choose from afterward",
      ],
      whyChoose: [
        "Posing and pacing that works across a range of ages in one session",
        "A studio environment comfortable for a longer, multi-person session",
        "The same studio families return to across newborn, baby and milestone sessions",
        "A relaxed approach — genuine interaction over stiff, lined-up posing",
      ],
      faqs: [
        {
          id: "family-size",
          question: "How many people can be included in a family session?",
          answer:
            "As many as make up your family — let us know the number when booking so the session can be planned around it.",
        },
        {
          id: "family-extended",
          question: "Do you photograph extended family, not just parents and children?",
          answer: "Yes — many family sessions include grandparents or other relatives.",
        },
        {
          id: "family-outfit",
          question: "What should we wear?",
          answer:
            "Coordinated, simple colors usually photograph best. Styling guidance is shared ahead of your session.",
        },
      ],
      relatedSlugs: ["baby", "maternity"],
    },
  };
}
