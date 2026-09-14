import type { Metadata } from "next";

import { AreaPageLayout } from "@/components/sections/area/AreaPageLayout";
import { areas } from "@/lib/data/areas";
import { buildPageMetadata } from "@/lib/seo/build-metadata";

const content = areas.bhaktapur;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata(content.href, { title: content.metaTitle, description: content.metaDescription });
}

export default function BhaktapurAreaPage() {
  return <AreaPageLayout content={content} />;
}
