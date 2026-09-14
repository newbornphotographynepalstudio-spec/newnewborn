import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { FaqForm } from "@/components/sections/admin/FaqForm";
import { getFaqAdmin } from "@/lib/faq/admin-data";

export const metadata: Metadata = {
  title: "Edit FAQ",
  robots: { index: false, follow: false },
};

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const faq = await getFaqAdmin(id);

  if (!faq) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-gutter py-2xl">
      <Link href="/admin/faqs" className="text-small text-plum hover:underline">
        ← All FAQs
      </Link>
      <h1 className="mt-4 text-h2 text-plum">Edit FAQ</h1>
      <div className="mt-8 border border-taupe/20 bg-white p-6">
        <FaqForm faq={faq} nextOrder={faq.order} />
      </div>
    </div>
  );
}
