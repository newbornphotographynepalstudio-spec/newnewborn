import type { Metadata } from "next";

import { ServicePageLayout } from "@/components/sections/service/ServicePageLayout";
import { getServicePages } from "@/lib/data/service-pages";

const pages = getServicePages();
const content = pages["cake-smash"];

export const metadata: Metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: content.href },
};

export default function CakeSmashPhotographyPage() {
  const related = content.relatedSlugs.map((slug) => pages[slug]);
  return <ServicePageLayout content={content} related={related} />;
}
