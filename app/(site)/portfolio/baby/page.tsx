import type { Metadata } from "next";

import { PortfolioCategoryLayout } from "@/components/sections/portfolio/PortfolioCategoryLayout";
import { portfolioCategories } from "@/lib/data/portfolio";

const category = portfolioCategories.find((c) => c.slug === "baby")!;

export const metadata: Metadata = {
  title: "Baby Portfolio",
  description: "Baby photography from Newborn Photography Nepal.",
  alternates: { canonical: category.href },
};

export default function BabyPortfolioPage() {
  return <PortfolioCategoryLayout category={category} />;
}
