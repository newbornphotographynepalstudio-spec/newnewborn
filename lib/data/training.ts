import type { FaqItem } from "@/lib/faq/types";

/**
 * Training content rewritten from factual information found on the
 * studio's existing training page (www.newbornphotographynpl.com/training —
 * same business, same phone number, and the same domain this site is
 * moving to once finalized) — see docs/ARCHITECTURE.md for the
 * research notes. Course names, durations, audiences, module topics and
 * inclusions are real; wording is rewritten into this site's voice, not
 * copied. No price is published on the reference page either, so none is
 * shown here — every tier ends in an enquiry, matching how the reference
 * page itself works ("Request Enrollment & Pricing").
 */

export type TrainingModule = {
  title: string;
  points: string[];
};

export type TrainingCourse = {
  id: "foundation" | "professional" | "master";
  name: string;
  duration: string;
  audience: string[];
  outcome: string;
  included: string[];
  modules: TrainingModule[];
};

export const trainingAudience = [
  "Complete beginners with no photography background",
  "Maternity or event photographers adding newborn sessions",
  "Working photographers who want to shoot newborns professionally",
  "Studio owners building or scaling a newborn photography business",
  "Parents who simply want to learn how to handle and photograph a newborn safely",
];

export const trainingCourses: TrainingCourse[] = [
  {
    id: "foundation",
    name: "Foundation Course",
    duration: "5 days, 1 hour a day",
    audience: [
      "Complete beginners",
      "Maternity photographers moving into newborn work",
      "Hobbyist photographers",
      "Parents wanting to learn the basics",
    ],
    outcome:
      "Wrap a newborn safely, work through basic poses, handle a baby confidently, and assist during a real session.",
    included: ["Certificate of completion", "Course notes", "7 days of WhatsApp support", "Live session participation"],
    modules: [
      {
        title: "Day 1 — Introduction",
        points: [
          "Newborn age windows and why timing matters (5–14 days)",
          "Safety principles and studio hygiene",
          "Reading baby behavior, equipment and camera settings",
        ],
      },
      {
        title: "Day 2 — Wrapping",
        points: [
          "Wrap types and safe wrapping technique",
          "Popular wrapping styles and transitioning between them",
          "Keeping a baby calm through a wrap change",
        ],
      },
      {
        title: "Day 3 — Basic Posing",
        points: [
          "Wrapped poses and bucket poses",
          "Beanbag setup and parent-assisted posing",
          "Safe transitions between poses",
        ],
      },
      {
        title: "Day 4 — Handling & Comforting",
        points: [
          "Reading a baby's cues and settling techniques",
          "White noise and temperature management",
          "Working with a sleepy or unsettled baby",
        ],
      },
      {
        title: "Day 5 — Live Session",
        points: [
          "Observe and assist during one real newborn session",
          "Practice wrapping and posing support",
          "See studio workflow and parent communication first-hand",
        ],
      },
    ],
  },
  {
    id: "professional",
    name: "Professional Photographer",
    duration: "12 days",
    audience: [
      "Photographers ready to shoot newborn sessions professionally",
      "Includes everything in the Foundation Course, plus advanced modules",
    ],
    outcome: "Run a professional newborn session independently, start to finish.",
    included: [
      "Certificate",
      "Editing presets",
      "Workflow PDFs and shooting checklists",
      "30 days of WhatsApp support",
      "3 live sessions — observe, assist, then lead",
    ],
    modules: [
      {
        title: "Safety & Handling",
        points: ["Newborn physiology and reflexes", "Safety spotting for composite poses", "Risk assessment"],
      },
      {
        title: "Professional Wrapping",
        points: ["Advanced wraps and variations", "Fast wrapping workflow", "Working to specific parent requests"],
      },
      {
        title: "Advanced Posing",
        points: [
          "Tushy up, side pose, chin on hands, taco pose, womb pose",
          "Composite froggy pose",
          "Posing with parents and siblings",
        ],
      },
      {
        title: "Lighting & Camera Masterclass",
        points: [
          "Window light, continuous light and flash",
          "Softboxes and shadow control",
          "Lens selection, white balance and composition",
        ],
      },
      {
        title: "Studio Workflow",
        points: ["Preparing parents and baby", "Managing the session timeline", "Troubleshooting a crying baby"],
      },
      {
        title: "Editing & Client Experience",
        points: [
          "Lightroom workflow and Photoshop basics",
          "Skin retouching and color grading",
          "Consultation, delivery and client communication",
        ],
      },
    ],
  },
  {
    id: "master",
    name: "Master Certification & Business Mentorship",
    duration: "1 month",
    audience: [
      "Photographers who want to build or scale a professional newborn photography business",
      "Includes everything in the Professional Course, plus business mentorship",
    ],
    outcome:
      "Run safe, professional sessions independently, set up and operate a premium studio, and build a business around it.",
    included: [
      "Contracts and pricing templates",
      "Welcome guides and marketing templates",
      "Editing workflow and gear guide",
      "Prop supplier contacts",
      "3 months of weekly mentorship",
    ],
    modules: [
      {
        title: "Photography Mastery",
        points: ["Every posing workflow, including twins and premature babies", "Sibling and family posing", "Luxury styling"],
      },
      {
        title: "Studio Setup & Gear",
        points: ["Choosing a location and designing a studio", "Furniture, heating and props", "Lighting purchase and budget planning"],
      },
      {
        title: "Editing Masterclass",
        points: ["Premium retouching and composite creation", "Background replacement", "Fast, high-end Photoshop workflows"],
      },
      {
        title: "Business Setup",
        points: ["Pricing strategy and packages", "Contracts and invoices", "Customer experience, upselling, albums and prints"],
      },
      {
        title: "Marketing & Client Acquisition",
        points: ["Instagram and Facebook marketing", "Organic reels and WhatsApp conversion", "SEO basics and handling enquiries"],
      },
      {
        title: "Branding & Financial Planning",
        points: ["Building a premium brand and portfolio", "Pricing for profit", "Setting targets and a scaling plan"],
      },
    ],
  },
];

export const trainingFaqs: FaqItem[] = [
  {
    id: "training-experience",
    question: "Do I need photography experience to join?",
    answer:
      "No — the Foundation Course is built for complete beginners as well as hobbyists and photographers moving into newborn work for the first time.",
  },
  {
    id: "training-hands-on",
    question: "Is the training hands-on?",
    answer:
      "Yes. Every course includes live session participation — observing and assisting during a real newborn session, not just watching demonstrations.",
  },
  {
    id: "training-which-course",
    question: "Which course is right for me?",
    answer:
      "It depends on where you're starting from — complete beginners typically start with the Foundation Course, working photographers with the Professional Course, and those building a studio business with the Master Certification. Mention your experience when you enquire and this can be talked through.",
  },
  {
    id: "training-next-steps",
    question: "What happens after I enquire?",
    answer:
      "You'll hear back directly to talk through the right course, current pricing and available dates.",
  },
];
