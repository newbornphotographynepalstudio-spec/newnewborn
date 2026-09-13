import type { Metadata } from "next";

import { PortfolioCategoryLayout } from "@/components/sections/portfolio/PortfolioCategoryLayout";
import { portfolioCategories } from "@/lib/data/portfolio";

const category = portfolioCategories.find((c) => c.slug === "cake-smash")!;

export const metadata: Metadata = {
  title: "Cake Smash Portfolio",
  description: "Cake smash photography from Newborn Photography Nepal.",
  alternates: { canonical: category.href },
};

export default function CakeSmashPortfolioPage() {
  return <PortfolioCategoryLayout category={category} />;
}
