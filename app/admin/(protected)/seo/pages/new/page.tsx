import type { Metadata } from "next";

import { PageSeoForm } from "@/components/sections/admin/PageSeoForm";
import { PageHeader } from "@/components/admin/ui/PageHeader";

export const metadata: Metadata = {
  title: "Add Page SEO Override",
  robots: { index: false, follow: false },
};

export default async function NewPageSeoOverridePage({
  searchParams,
}: {
  searchParams: Promise<{ path?: string }>;
}) {
  const { path } = await searchParams;
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Add Page SEO Override" back={{ href: "/admin/seo/pages", label: "Page SEO" }} />
      <PageSeoForm initialPath={path} />
    </div>
  );
}
