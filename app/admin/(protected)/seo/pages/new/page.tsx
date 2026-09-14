import Link from "next/link";
import type { Metadata } from "next";

import { PageSeoForm } from "@/components/sections/admin/PageSeoForm";

export const metadata: Metadata = {
  title: "Add Page SEO Override",
  robots: { index: false, follow: false },
};

export default function NewPageSeoOverridePage() {
  return (
    <div className="mx-auto max-w-2xl px-gutter py-2xl">
      <Link href="/admin/seo/pages" className="text-small text-plum hover:underline">
        ← Page SEO
      </Link>
      <h1 className="mt-4 text-h2 text-plum">Add Page SEO Override</h1>
      <div className="mt-8 border border-taupe/20 bg-white p-6">
        <PageSeoForm />
      </div>
    </div>
  );
}
