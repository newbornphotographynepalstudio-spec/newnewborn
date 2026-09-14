import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { PageSeoForm } from "@/components/sections/admin/PageSeoForm";
import { getPageSeoOverrideByDocId } from "@/lib/seo/page-overrides";

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
    <div className="mx-auto max-w-2xl px-gutter py-2xl">
      <Link href="/admin/seo/pages" className="text-small text-plum hover:underline">
        ← Page SEO
      </Link>
      <h1 className="mt-4 text-h2 text-plum">Edit {override.path}</h1>
      <div className="mt-8 border border-taupe/20 bg-white p-6">
        <PageSeoForm override={override} />
      </div>
    </div>
  );
}
