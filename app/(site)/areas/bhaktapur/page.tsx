import type { Metadata } from "next";

import { AreaPageLayout } from "@/components/sections/area/AreaPageLayout";
import { areas } from "@/lib/data/areas";

const content = areas.bhaktapur;

export const metadata: Metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: content.href },
};

export default function BhaktapurAreaPage() {
  return <AreaPageLayout content={content} />;
}
