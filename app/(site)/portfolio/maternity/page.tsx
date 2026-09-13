import type { Metadata } from "next";

import { PortfolioCategoryLayout } from "@/components/sections/portfolio/PortfolioCategoryLayout";
import { portfolioCategories } from "@/lib/data/portfolio";

const category = portfolioCategories.find((c) => c.slug === "maternity")!;

export const metadata: Metadata = {
  title: "Maternity Portfolio",
  description: "Maternity photography from Newborn Photography Nepal.",
  alternates: { canonical: category.href },
};

export default function MaternityPortfolioPage() {
  return <PortfolioCategoryLayout category={category} />;
}
