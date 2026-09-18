"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { savePackage, type PackageFormState } from "@/lib/packages/actions";
import type { AdminPackage } from "@/lib/packages/admin-data";
import { AdminButton } from "@/components/admin/ui/Button";
import { AdminCheckbox, AdminInput, AdminTextarea, FormField } from "@/components/admin/ui/fields";
import { FormMessage } from "@/components/admin/ui/FormMessage";

const initialState: PackageFormState = { status: "idle" };

export function PackageForm({ pkg, nextOrder }: { pkg?: AdminPackage; nextOrder: number }) {
  const [state, formAction, pending] = useActionState(savePackage, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.status === "success") {
      router.push("/admin/packages");
      router.refresh();
    }
  }, [state.status, router]);

  return (
    <form action={formAction} className="space-y-6">
      {pkg ? <input type="hidden" name="id" value={pkg.id} /> : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Name" htmlFor="name" required>
          <AdminInput id="name" name="name" defaultValue={pkg?.name} required />
        </FormField>
        <FormField label="Order" htmlFor="order">
          <AdminInput id="order" name="order" type="number" defaultValue={String(pkg?.order ?? nextOrder)} />
        </FormField>
      </div>

      <FormField label="Tagline" htmlFor="tagline">
        <AdminInput id="tagline" name="tagline" defaultValue={pkg?.tagline} />
      </FormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Price (number, NPR)" htmlFor="price" required>
          <AdminInput
            id="price"
            name="price"
            type="number"
            defaultValue={pkg?.price ? String(pkg.price) : ""}
            required
          />
        </FormField>
        <FormField label="Price label (shown on site)" htmlFor="priceLabel" required>
          <AdminInput id="priceLabel" name="priceLabel" defaultValue={pkg?.priceLabel} required placeholder="NPR 7,999" />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FormField label="Duration" htmlFor="duration" required>
          <AdminInput id="duration" name="duration" defaultValue={pkg?.duration} required />
        </FormField>
        <FormField label="Setups" htmlFor="setups">
          <AdminInput id="setups" name="setups" defaultValue={pkg?.setups} />
        </FormField>
        <FormField label="Edited photos" htmlFor="editedPhotos">
          <AdminInput id="editedPhotos" name="editedPhotos" defaultValue={pkg?.editedPhotos} />
        </FormField>
      </div>

      <FormField label="Includes" htmlFor="includes" help="One per line.">
        <AdminTextarea id="includes" name="includes" rows={6} defaultValue={pkg?.includes?.join("\n")} />
      </FormField>

      <AdminCheckbox
        name="featured"
        defaultChecked={pkg?.featured}
        label={'Featured (highlighted as "Most Chosen")'}
      />

      <div className="flex items-center gap-4 border-t border-slate-100 pt-4">
        <AdminButton type="submit" variant="primary" disabled={pending}>
          {pending ? "Saving…" : "Save Package"}
        </AdminButton>
        {state.status === "error" && state.message ? <FormMessage status="error" message={state.message} /> : null}
      </div>
    </form>
  );
}
