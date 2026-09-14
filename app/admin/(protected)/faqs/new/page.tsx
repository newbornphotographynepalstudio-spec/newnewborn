import Link from "next/link";
import type { Metadata } from "next";

import { FaqForm } from "@/components/sections/admin/FaqForm";
import { listFaqsAdmin } from "@/lib/faq/admin-data";

export const metadata: Metadata = {
  title: "New FAQ",
  robots: { index: false, follow: false },
};

export default async function NewFaqPage() {
  const result = await listFaqsAdmin();
  const nextOrder = result.configured ? result.faqs.length : 0;

  return (
    <div className="mx-auto max-w-2xl px-gutter py-2xl">
      <Link href="/admin/faqs" className="text-small text-plum hover:underline">
        ← All FAQs
      </Link>
      <h1 className="mt-4 text-h2 text-plum">Add FAQ</h1>
      <div className="mt-8 border border-taupe/20 bg-white p-6">
        <FaqForm nextOrder={nextOrder} />
      </div>
    </div>
  );
}
