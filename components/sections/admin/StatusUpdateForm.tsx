"use client";

import { useActionState } from "react";

import { updateInquiryStatus, type UpdateStatusState } from "@/lib/inquiries/actions";
import { INQUIRY_STATUSES, STATUS_LABELS, type InquiryStatus } from "@/lib/inquiries/types";
import { AdminButton } from "@/components/admin/ui/Button";
import { AdminSelect, FormField } from "@/components/admin/ui/fields";
import { FormMessage } from "@/components/admin/ui/FormMessage";

const initialState: UpdateStatusState = { status: "idle" };

export function StatusUpdateForm({ id, currentStatus }: { id: string; currentStatus: InquiryStatus }) {
  const [state, formAction, pending] = useActionState(updateInquiryStatus, initialState);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-4">
      <input type="hidden" name="id" value={id} />
      <FormField label="Status" htmlFor="status" className="w-48">
        <AdminSelect id="status" name="status" defaultValue={currentStatus}>
          {INQUIRY_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </AdminSelect>
      </FormField>
      <AdminButton type="submit" variant="primary" disabled={pending}>
        {pending ? "Saving…" : "Update Status"}
      </AdminButton>
      {state.status !== "idle" && state.message ? (
        <FormMessage status={state.status === "error" ? "error" : "success"} message={state.message} />
      ) : null}
    </form>
  );
}
