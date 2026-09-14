import Link from "next/link";
import type { Metadata } from "next";

import { DeleteFaqButton } from "@/components/sections/admin/DeleteFaqButton";
import { listFaqsAdmin } from "@/lib/faq/admin-data";

export const metadata: Metadata = {
  title: "FAQs",
  robots: { index: false, follow: false },
};

export default async function AdminFaqsPage() {
  const result = await listFaqsAdmin();

  return (
    <div className="mx-auto max-w-4xl px-gutter py-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h2 text-plum">FAQs</h1>
          <p className="mt-2xs text-small text-charcoal/70">
            Shown on /faq/. The first 5, by order, also appear on the homepage.
          </p>
        </div>
        <Link href="/admin/faqs/new" className="rounded-sm bg-plum px-4 py-2 text-small font-medium text-white">
          Add FAQ
        </Link>
      </div>

      {!result.configured ? (
        <div className="mt-lg border border-dashed border-taupe/40 bg-white p-lg text-small text-taupe">
          Firebase Admin credentials aren&apos;t configured in this environment yet. The public
          site still shows the approved fallback FAQ content.
        </div>
      ) : result.faqs.length === 0 ? (
        <div className="mt-lg border border-dashed border-taupe/40 bg-white p-lg text-small text-taupe">
          No FAQs in Firestore yet, the public site is showing the original approved fallback
          content. Add one here to start managing FAQs from admin.
        </div>
      ) : (
        <div className="mt-lg divide-y divide-taupe/15 border border-taupe/20 bg-white">
          {result.faqs.map((faq) => (
            <div key={faq.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div>
                <p className="text-caption text-taupe">#{faq.order}</p>
                <Link href={`/admin/faqs/${faq.id}`} className="font-medium text-plum hover:underline">
                  {faq.question}
                </Link>
              </div>
              <DeleteFaqButton id={faq.id} question={faq.question} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
