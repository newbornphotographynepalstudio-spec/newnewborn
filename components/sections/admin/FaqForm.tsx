"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { saveFaq, type FaqFormState } from "@/lib/faq/actions";
import type { AdminFaqItem } from "@/lib/faq/admin-data";
import { AdminButton } from "@/components/admin/ui/Button";
import { AdminInput, AdminTextarea, FormField } from "@/components/admin/ui/fields";
import { FormMessage } from "@/components/admin/ui/FormMessage";

const initialState: FaqFormState = { status: "idle" };

export function FaqForm({ faq, nextOrder }: { faq?: AdminFaqItem; nextOrder: number }) {
  const [state, formAction, pending] = useActionState(saveFaq, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.status === "success") {
      router.push("/admin/faqs");
      router.refresh();
    }
  }, [state.status, router]);

  return (
    <form action={formAction} className="space-y-4">
      {faq ? <input type="hidden" name="id" value={faq.id} /> : null}
      <FormField label="Question" htmlFor="question" required>
        <AdminInput id="question" name="question" type="text" defaultValue={faq?.question} required />
      </FormField>
      <FormField label="Answer" htmlFor="answer" required>
        <AdminTextarea id="answer" name="answer" rows={4} defaultValue={faq?.answer} required />
      </FormField>
      <FormField
        label="Order"
        htmlFor="order"
        help="The first 5, by order, also show on the homepage preview."
      >
        <AdminInput id="order" name="order" type="number" defaultValue={faq?.order ?? nextOrder} className="w-32" />
      </FormField>

      <div className="flex items-center gap-4 border-t border-slate-100 pt-4">
        <AdminButton type="submit" variant="primary" disabled={pending}>
          {pending ? "Saving…" : "Save FAQ"}
        </AdminButton>
        {state.status === "error" && state.message ? <FormMessage status="error" message={state.message} /> : null}
      </div>
    </form>
  );
}
