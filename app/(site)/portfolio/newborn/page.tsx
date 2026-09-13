import type { Metadata } from "next";

import { PortfolioCategoryLayout } from "@/components/sections/portfolio/PortfolioCategoryLayout";
import { portfolioCategories } from "@/lib/data/portfolio";
import { cultureHeritageImage } from "@/lib/media/approved-assets";

const category = portfolioCategories.find((c) => c.slug === "newborn")!;

export const metadata: Metadata = {
  title: "Newborn Portfolio",
  description: "Newborn photography from Newborn Photography Nepal.",
  alternates: { canonical: category.href },
};

export default function NewbornPortfolioPage() {
  return (
    <PortfolioCategoryLayout
      category={category}
      featuredImage={cultureHeritageImage.src}
      featuredAlt={cultureHeritageImage.alt}
    />
  );
}
