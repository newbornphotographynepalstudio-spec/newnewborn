"use client";

import { useActionState } from "react";

import { saveInquiryNotes, type NotesFormState } from "@/lib/inquiries/actions";

const initialState: NotesFormState = { status: "idle" };

export function NotesForm({
  id,
  adminNotes,
  followUpDate,
}: {
  id: string;
  adminNotes?: string;
  followUpDate?: string;
}) {
  const [state, formAction, pending] = useActionState(saveInquiryNotes, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={id} />
      <div>
        <label htmlFor="followUpDate" className="block text-caption tracking-eyebrow text-taupe uppercase">
          Follow-up date
        </label>
        <input
          id="followUpDate"
          name="followUpDate"
          type="date"
          defaultValue={followUpDate}
          className="mt-2 rounded-sm border border-taupe/40 bg-white px-3 py-2 text-small text-charcoal"
        />
      </div>
      <div>
        <label htmlFor="adminNotes" className="block text-caption tracking-eyebrow text-taupe uppercase">
          Notes (internal only, never shown to the customer)
        </label>
        <textarea
          id="adminNotes"
          name="adminNotes"
          rows={4}
          defaultValue={adminNotes}
          className="mt-2 w-full rounded-sm border border-taupe/40 bg-white px-3 py-2 text-small text-charcoal"
        />
      </div>
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-sm bg-plum px-4 py-2 text-small font-medium text-white disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save Notes"}
        </button>
        {state.status !== "idle" && state.message ? (
          <p className={`text-caption ${state.status === "error" ? "text-plum" : "text-taupe"}`}>{state.message}</p>
        ) : null}
      </div>
    </form>
  );
}
