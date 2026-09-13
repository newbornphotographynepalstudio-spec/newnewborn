import type { Metadata } from "next";

import { ServicePageLayout } from "@/components/sections/service/ServicePageLayout";
import { getServicePages } from "@/lib/data/service-pages";
import { cultureHeritageImage } from "@/lib/media/approved-assets";

const pages = getServicePages(cultureHeritageImage.src, cultureHeritageImage.alt);
const content = pages.baby;

export const metadata: Metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: content.href },
};

export default function BabyPhotographyPage() {
  const related = content.relatedSlugs.map((slug) => pages[slug]);
  return <ServicePageLayout content={content} related={related} />;
}
