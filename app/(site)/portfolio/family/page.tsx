import type { Metadata } from "next";

import { PortfolioCategoryLayout } from "@/components/sections/portfolio/PortfolioCategoryLayout";
import { portfolioCategories } from "@/lib/data/portfolio";

const category = portfolioCategories.find((c) => c.slug === "family")!;

export const metadata: Metadata = {
  title: "Family Portfolio",
  description: "Family photography from Newborn Photography Nepal.",
  alternates: { canonical: category.href },
};

export default function FamilyPortfolioPage() {
  return <PortfolioCategoryLayout category={category} />;
}
