import familyHeritagePortrait from "@/public/photography/newborn/family-heritage-portrait.webp";
import newbornRobeChair from "@/public/photography/newborn/newborn-robe-chair.webp";
import newbornSnailBasket from "@/public/photography/newborn/newborn-snail-basket.webp";
import newbornTutuBed from "@/public/photography/newborn/newborn-tutu-bed.webp";
import newbornWrappedBucket from "@/public/photography/newborn/newborn-wrapped-bucket.webp";
import newbornYellowWrap from "@/public/photography/newborn/newborn-yellow-wrap.webp";

import type { MediaAsset } from "@/lib/media/types";

/**
 * The real newborn session photography — 6 images, client-supplied,
 * copied into public/photography/newborn/ (originals untouched in
 * Newborn/ at the project root). Crop directions below reflect where the
 * subject actually sits in each frame (checked by viewing each photo),
 * not a generic default — confirm visually if a photo is ever swapped.
 */
export const newbornGallery: MediaAsset[] = [
  {
    id: "newborn-family-heritage",
    src: familyHeritagePortrait,
    width: 1600,
    height: 1600,
    orientation: "square",
    alt: "Three generations, grandmother, mother and newborn baby, dressed in traditional Nepali jewelry and clothing for a family portrait, with a floral backdrop.",
    title: "A family portrait, three generations",
    category: "heritage",
    service: "newborn",
    desktopAspect: "square",
    mobileAspect: "square",
    objectPosition: "center",
    seoDescription:
      "Grandmother, mother and newborn baby in traditional Nepali dress and gold jewelry, photographed together during a newborn photography session in Nepal.",
    homepageApproved: true,
    portfolioApproved: true,
  },
  {
    id: "newborn-tutu-bed",
    src: newbornTutuBed,
    width: 1600,
    height: 1170,
    orientation: "landscape",
    alt: "Newborn baby girl sleeping on a miniature wooden bed prop, wearing a purple tulle skirt and a flower headband, with purple and white flowers in the foreground.",
    category: "newborn",
    service: "newborn",
    desktopAspect: "landscape",
    mobileAspect: "portrait",
    objectPosition: "left",
    seoDescription:
      "Sleeping newborn baby girl in a purple tutu on a miniature bed prop, styled with flowers, during a newborn photography session.",
    homepageApproved: false,
    portfolioApproved: true,
  },
  {
    id: "newborn-wrapped-bucket",
    src: newbornWrappedBucket,
    width: 1066,
    height: 1600,
    orientation: "portrait",
    alt: "Smiling newborn baby wrapped in a brown knit wrap and matching bonnet, sitting inside a wooden bucket prop with white flowers, against a wood-plank backdrop.",
    category: "newborn",
    service: "newborn",
    desktopAspect: "portrait",
    mobileAspect: "portrait",
    objectPosition: "center",
    seoDescription:
      "Smiling newborn baby wrapped in a brown knit wrap, seated in a wooden bucket prop during a studio newborn photography session in Nepal.",
    homepageApproved: false,
    portfolioApproved: true,
  },
  {
    id: "newborn-yellow-wrap",
    src: newbornYellowWrap,
    width: 1600,
    height: 1066,
    orientation: "landscape",
    alt: "Newborn baby wrapped in a yellow wrap, sleeping on a small wooden bed prop against a warm yellow studio backdrop with yellow flowers.",
    category: "newborn",
    service: "newborn",
    desktopAspect: "landscape",
    mobileAspect: "portrait",
    objectPosition: "left",
    seoDescription:
      "Newborn baby sleeping in a yellow wrap on a wooden bed prop, photographed against a warm yellow backdrop in a Nepal newborn photography studio.",
    homepageApproved: false,
    portfolioApproved: true,
  },
  {
    id: "newborn-snail-basket",
    src: newbornSnailBasket,
    width: 1600,
    height: 1129,
    orientation: "landscape",
    alt: "Newborn baby dressed in a crocheted snail costume, sleeping in a wicker basket bassinet lined with a blue knit blanket and palm fronds.",
    category: "newborn",
    service: "newborn",
    desktopAspect: "landscape",
    mobileAspect: "portrait",
    objectPosition: "right",
    seoDescription:
      "Newborn baby in a whimsical crocheted snail costume, sleeping in a wicker basket during a creative newborn photography session.",
    homepageApproved: false,
    portfolioApproved: true,
  },
  {
    id: "newborn-robe-chair",
    src: newbornRobeChair,
    width: 1290,
    height: 1600,
    orientation: "portrait",
    alt: "Newborn baby dressed in a miniature white spa robe and towel wrap, posed sitting in a round fur chair beside sunglasses and a small flower arrangement.",
    category: "newborn",
    service: "newborn",
    desktopAspect: "portrait",
    mobileAspect: "portrait",
    objectPosition: "center",
    seoDescription:
      "Newborn baby styled in a miniature spa robe and towel turban, seated in a round fur chair for a playful newborn photography portrait.",
    homepageApproved: false,
    portfolioApproved: true,
  },
];
