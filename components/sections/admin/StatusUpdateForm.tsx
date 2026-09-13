"use client";

import { useActionState } from "react";

import { updateInquiryStatus, type UpdateStatusState } from "@/lib/inquiries/actions";
import { INQUIRY_STATUSES, STATUS_LABELS, type InquiryStatus } from "@/lib/inquiries/types";

const initialState: UpdateStatusState = { status: "idle" };

export function StatusUpdateForm({ id, currentStatus }: { id: string; currentStatus: InquiryStatus }) {
  const [state, formAction, pending] = useActionState(updateInquiryStatus, initialState);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-4">
      <input type="hidden" name="id" value={id} />
      <div>
        <label htmlFor="status" className="block text-caption tracking-eyebrow text-taupe uppercase">
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={currentStatus}
          className="mt-2 rounded-sm border border-taupe/40 bg-white px-3 py-2 text-small text-charcoal"
        >
          {INQUIRY_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-sm bg-plum px-4 py-2 text-small text-white disabled:opacity-50"
      >
        {pending ? "Saving…" : "Update Status"}
      </button>
      {state.status !== "idle" && state.message ? (
        <p className={`text-caption ${state.status === "error" ? "text-plum" : "text-taupe"}`}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
