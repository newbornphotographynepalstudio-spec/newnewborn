import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { PageSeoForm } from "@/components/sections/admin/PageSeoForm";
import { getPageSeoOverrideByDocId } from "@/lib/seo/page-overrides";
import { PageHeader } from "@/components/admin/ui/PageHeader";

export const metadata: Metadata = {
  title: "Edit Page SEO",
  robots: { index: false, follow: false },
};

export default async function EditPageSeoOverridePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const override = await getPageSeoOverrideByDocId(id);

  if (!override) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title={`Edit ${override.path}`} back={{ href: "/admin/seo/pages", label: "Page SEO" }} />
      <PageSeoForm override={override} />
    </div>
  );
}
