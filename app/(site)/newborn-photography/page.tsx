import type { Metadata } from "next";

import { ServicePageLayout } from "@/components/sections/service/ServicePageLayout";
import { getServicePages } from "@/lib/data/service-pages";
import { buildPageMetadata } from "@/lib/seo/build-metadata";

const pages = getServicePages();
const content = pages.newborn;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata(content.href, { title: content.metaTitle, description: content.metaDescription });
}

export default function NewbornPhotographyPage() {
  const related = content.relatedSlugs.map((slug) => pages[slug]);
  return <ServicePageLayout content={content} related={related} />;
}
