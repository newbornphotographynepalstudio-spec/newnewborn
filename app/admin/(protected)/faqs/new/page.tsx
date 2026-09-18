import type { Metadata } from "next";

import { FaqForm } from "@/components/sections/admin/FaqForm";
import { listFaqsAdmin } from "@/lib/faq/admin-data";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Card } from "@/components/admin/ui/Card";

export const metadata: Metadata = {
  title: "New FAQ",
  robots: { index: false, follow: false },
};

export default async function NewFaqPage() {
  const result = await listFaqsAdmin();
  const nextOrder = result.configured ? result.faqs.length : 0;

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Add FAQ" back={{ href: "/admin/faqs", label: "All FAQs" }} />
      <Card className="p-6">
        <FaqForm nextOrder={nextOrder} />
      </Card>
    </div>
  );
}
