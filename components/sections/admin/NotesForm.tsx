"use client";

import { useActionState } from "react";

import { saveInquiryNotes, type NotesFormState } from "@/lib/inquiries/actions";
import { AdminButton } from "@/components/admin/ui/Button";
import { AdminInput, AdminTextarea, FormField } from "@/components/admin/ui/fields";
import { FormMessage } from "@/components/admin/ui/FormMessage";

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
      <FormField label="Follow-up date" htmlFor="followUpDate" className="w-52">
        <AdminInput id="followUpDate" name="followUpDate" type="date" defaultValue={followUpDate} />
      </FormField>
      <FormField label="Notes" htmlFor="adminNotes" help="Internal only, never shown to the customer.">
        <AdminTextarea id="adminNotes" name="adminNotes" rows={4} defaultValue={adminNotes} />
      </FormField>
      <div className="flex items-center gap-4">
        <AdminButton type="submit" variant="primary" disabled={pending}>
          {pending ? "Saving…" : "Save Notes"}
        </AdminButton>
        {state.status !== "idle" && state.message ? (
          <FormMessage status={state.status === "error" ? "error" : "success"} message={state.message} />
        ) : null}
      </div>
    </form>
  );
}
