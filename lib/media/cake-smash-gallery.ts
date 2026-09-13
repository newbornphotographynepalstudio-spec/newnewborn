import cakesmashBalloonPortrait from "@/public/photography/cake-smash/cakesmash-balloon-portrait.webp";
import cakesmashBohoSunflower from "@/public/photography/cake-smash/cakesmash-boho-sunflower.webp";
import cakesmashCakeMoment from "@/public/photography/cake-smash/cakesmash-cake-moment.webp";
import cakesmashHandRaised from "@/public/photography/cake-smash/cakesmash-hand-raised.webp";
import cakesmashMessySmile from "@/public/photography/cake-smash/cakesmash-messy-smile.webp";

import type { MediaAsset } from "@/lib/media/types";

/**
 * Real cake smash session photography — 5 images, client-supplied, copied
 * into public/photography/cake-smash/ (originals untouched in
 * "cake smash/" at the project root). `cakesmash-cake-moment`,
 * `cakesmash-messy-smile` and `cakesmash-hand-raised` are the same
 * one-year-old's session (pink dress, purple balloon garland, "ONE"
 * marquee); `cakesmash-balloon-portrait` and `cakesmash-boho-sunflower`
 * are separate sessions/setups, included as celebration/setup moments
 * rather than the literal cake-smash instant.
 */
export const cakeSmashGallery: MediaAsset[] = [
  {
    id: "cakesmash-messy-smile",
    src: cakesmashMessySmile,
    width: 1066,
    height: 1600,
    orientation: "portrait",
    alt: "Laughing one-year-old girl with cake frosting on her face and hands, mid cake smash in a pink tulle dress, with a purple and pink balloon garland behind her.",
    title: "The moment it becomes a cake smash",
    category: "cake-smash",
    service: "cake-smash",
    desktopAspect: "portrait",
    mobileAspect: "portrait",
    objectPosition: "center",
    seoDescription:
      "One-year-old girl laughing with cake frosting on her face and hands during a first-birthday cake smash photography session in Nepal.",
    homepageApproved: false,
    portfolioApproved: true,
  },
  {
    id: "cakesmash-cake-moment",
    src: cakesmashCakeMoment,
    width: 1600,
    height: 1066,
    orientation: "landscape",
    alt: "One-year-old girl in a pink tulle dress and fascinator sitting in front of a white cake decorated with roses, with a purple balloon garland and teddy bears in the background.",
    category: "cake-smash",
    service: "cake-smash",
    desktopAspect: "landscape",
    mobileAspect: "portrait",
    objectPosition: "center",
    seoDescription:
      "One-year-old girl dressed in pink tulle beside a rose-decorated first-birthday cake, styled for a cake smash photography session.",
    homepageApproved: false,
    portfolioApproved: true,
  },
  {
    id: "cakesmash-hand-raised",
    src: cakesmashHandRaised,
    width: 1600,
    height: 1066,
    orientation: "landscape",
    alt: "One-year-old girl with cake frosting on her face and her hand raised showing more frosting, sitting beside a smashed cake with an illuminated \"ONE\" sign behind her.",
    category: "cake-smash",
    service: "cake-smash",
    desktopAspect: "landscape",
    mobileAspect: "portrait",
    objectPosition: "center",
    seoDescription:
      "One-year-old girl with cake frosting on her hands and face beside a smashed birthday cake, photographed during a cake smash session in Nepal.",
    homepageApproved: false,
    portfolioApproved: true,
  },
  {
    id: "cakesmash-balloon-portrait",
    src: cakesmashBalloonPortrait,
    width: 1240,
    height: 1600,
    orientation: "portrait",
    alt: "One-year-old girl in a pink tutu and headband holding a pink balloon beside a rattan hanging chair, styled for a birthday photography session against a purple backdrop.",
    category: "cake-smash",
    service: "cake-smash",
    desktopAspect: "portrait",
    mobileAspect: "portrait",
    objectPosition: "center",
    seoDescription:
      "One-year-old girl in a pink tutu holding a balloon beside a rattan chair, part of a first-birthday photography session in Nepal.",
    homepageApproved: false,
    portfolioApproved: true,
  },
  {
    id: "cakesmash-boho-sunflower",
    src: cakesmashBohoSunflower,
    width: 1600,
    height: 1066,
    orientation: "landscape",
    alt: "Smiling baby girl in a sunflower-print outfit sitting in a sunflower-themed boho photography set with a mini macrame teepee, greenery garland and a wooden crate.",
    category: "setup",
    service: "cake-smash",
    desktopAspect: "landscape",
    mobileAspect: "portrait",
    objectPosition: "center",
    seoDescription:
      "Baby girl smiling in a sunflower-themed boho birthday photography set, an alternative styled setup from a cake smash session in Nepal.",
    homepageApproved: false,
    portfolioApproved: true,
  },
];
