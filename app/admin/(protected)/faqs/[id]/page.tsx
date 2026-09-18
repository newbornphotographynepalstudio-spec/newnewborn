import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { FaqForm } from "@/components/sections/admin/FaqForm";
import { getFaqAdmin } from "@/lib/faq/admin-data";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Card } from "@/components/admin/ui/Card";

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
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Edit FAQ" back={{ href: "/admin/faqs", label: "All FAQs" }} />
      <Card className="p-6">
        <FaqForm faq={faq} nextOrder={faq.order} />
      </Card>
    </div>
  );
}
