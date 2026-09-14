import type { Metadata } from "next";

import { PortfolioCategoryLayout } from "@/components/sections/portfolio/PortfolioCategoryLayout";
import { portfolioCategories } from "@/lib/data/portfolio";
import { buildPageMetadata } from "@/lib/seo/build-metadata";

const category = portfolioCategories.find((c) => c.slug === "baby")!;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata(category.href, {
    title: "Baby Portfolio",
    description: "Baby photography from Newborn Photography Nepal.",
  });
}

export default function BabyPortfolioPage() {
  return <PortfolioCategoryLayout category={category} />;
}
