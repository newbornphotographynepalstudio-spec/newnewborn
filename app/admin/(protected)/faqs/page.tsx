import Link from "next/link";
import type { Metadata } from "next";

import { listFaqsAdmin } from "@/lib/faq/admin-data";
import { deleteFaq } from "@/lib/faq/actions";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { AdminButton } from "@/components/admin/ui/Button";
import { Card } from "@/components/admin/ui/Card";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { ConfirmDeleteButton } from "@/components/admin/ui/ConfirmDialog";
import { FaqIcon, PlusIcon } from "@/components/admin/ui/icons";

export const metadata: Metadata = {
  title: "FAQs",
  robots: { index: false, follow: false },
};

export default async function AdminFaqsPage() {
  const result = await listFaqsAdmin();

  return (
    <div>
      <PageHeader
        title="FAQs"
        description="Shown on /faq/. The first 5, by order, also appear on the homepage."
        action={
          <AdminButton href="/admin/faqs/new" variant="primary" icon={<PlusIcon width={15} height={15} />}>
            Add FAQ
          </AdminButton>
        }
      />

      {!result.configured ? (
        <EmptyState
          icon={<FaqIcon width={28} height={28} />}
          title="Firebase Admin credentials aren't configured"
          description="This environment can't load FAQs yet."
        />
      ) : result.faqs.length === 0 ? (
        <EmptyState
          icon={<FaqIcon width={28} height={28} />}
          title="No FAQs in Firestore yet"
          description="The public site is showing the original approved fallback content. Add one to start managing FAQs from admin."
          action={
            <AdminButton href="/admin/faqs/new" variant="primary">
              Add FAQ
            </AdminButton>
          }
        />
      ) : (
        <Card className="divide-y divide-slate-100">
          {result.faqs.map((faq) => (
            <div key={faq.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <p className="text-xs text-slate-400">#{faq.order}</p>
                <Link href={`/admin/faqs/${faq.id}`} className="truncate font-medium text-slate-900 hover:text-plum">
                  {faq.question}
                </Link>
              </div>
              <ConfirmDeleteButton
                itemLabel={faq.question}
                onConfirm={deleteFaq.bind(null, faq.id)}
              />
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
