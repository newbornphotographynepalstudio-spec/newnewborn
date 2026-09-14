"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { saveFaq, type FaqFormState } from "@/lib/faq/actions";
import type { AdminFaqItem } from "@/lib/faq/admin-data";

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
      <div>
        <label htmlFor="question" className="block text-caption tracking-eyebrow text-taupe uppercase">
          Question
        </label>
        <input
          id="question"
          name="question"
          type="text"
          defaultValue={faq?.question}
          required
          className="mt-2 w-full rounded-sm border border-taupe/40 bg-white px-3 py-2 text-small text-charcoal"
        />
      </div>
      <div>
        <label htmlFor="answer" className="block text-caption tracking-eyebrow text-taupe uppercase">
          Answer
        </label>
        <textarea
          id="answer"
          name="answer"
          rows={4}
          defaultValue={faq?.answer}
          required
          className="mt-2 w-full rounded-sm border border-taupe/40 bg-white px-3 py-2 text-small text-charcoal"
        />
      </div>
      <div>
        <label htmlFor="order" className="block text-caption tracking-eyebrow text-taupe uppercase">
          Order (the first 5, by order, also show on the homepage preview)
        </label>
        <input
          id="order"
          name="order"
          type="number"
          defaultValue={faq?.order ?? nextOrder}
          className="mt-2 w-32 rounded-sm border border-taupe/40 bg-white px-3 py-2 text-small text-charcoal"
        />
      </div>
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-sm bg-plum px-5 py-2.5 text-small font-medium text-white disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save FAQ"}
        </button>
        {state.status === "error" && state.message ? <p className="text-caption text-plum">{state.message}</p> : null}
      </div>
    </form>
  );
}
