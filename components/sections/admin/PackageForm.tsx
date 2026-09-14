"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { savePackage, type PackageFormState } from "@/lib/packages/actions";
import type { AdminPackage } from "@/lib/packages/admin-data";

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
        <Field label="Name" name="name" defaultValue={pkg?.name} required />
        <Field label="Order" name="order" type="number" defaultValue={String(pkg?.order ?? nextOrder)} />
      </div>

      <Field label="Tagline" name="tagline" defaultValue={pkg?.tagline} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Price (number, NPR)" name="price" type="number" defaultValue={pkg?.price ? String(pkg.price) : ""} required />
        <Field label="Price label (shown on site)" name="priceLabel" defaultValue={pkg?.priceLabel} required placeholder="NPR 7,999" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Duration" name="duration" defaultValue={pkg?.duration} required />
        <Field label="Setups" name="setups" defaultValue={pkg?.setups} />
        <Field label="Edited photos" name="editedPhotos" defaultValue={pkg?.editedPhotos} />
      </div>

      <div>
        <label className="block text-caption tracking-eyebrow text-taupe uppercase">
          Includes (one per line)
        </label>
        <textarea
          name="includes"
          rows={6}
          defaultValue={pkg?.includes?.join("\n")}
          className="mt-2 w-full rounded-sm border border-taupe/40 bg-white px-3 py-2 text-small text-charcoal"
        />
      </div>

      <label className="flex items-center gap-2 text-small text-charcoal">
        <input type="checkbox" name="featured" defaultChecked={pkg?.featured} className="h-4 w-4" />
        Featured (highlighted as &quot;Most Chosen&quot;)
      </label>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-sm bg-plum px-5 py-2.5 text-small font-medium text-white disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save Package"}
        </button>
        {state.status === "error" && state.message ? (
          <p className="text-caption text-plum">{state.message}</p>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-caption tracking-eyebrow text-taupe uppercase">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full rounded-sm border border-taupe/40 bg-white px-3 py-2 text-small text-charcoal"
      />
    </div>
  );
}
