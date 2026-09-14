"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { savePageSeoOverride, type PageSeoFormState } from "@/lib/seo/page-overrides-actions";
import type { PageSeoOverride } from "@/lib/seo/page-overrides";

const initialState: PageSeoFormState = { status: "idle" };

export function PageSeoForm({ override, initialPath }: { override?: PageSeoOverride; initialPath?: string }) {
  const [state, formAction, pending] = useActionState(savePageSeoOverride, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.status === "success") {
      router.push("/admin/seo/pages");
      router.refresh();
    }
  }, [state.status, router]);

  return (
    <form action={formAction} className="space-y-4">
      {/* Disabled inputs never submit their value — a hidden field carries
          the real path when editing, since the path itself can't change
          (it's the document's identity). */}
      {override ? <input type="hidden" name="path" value={override.path} /> : null}
      <Field
        label="Page path"
        name={override ? "pathDisplay" : "path"}
        defaultValue={override?.path ?? initialPath}
        placeholder="/about/"
        required={!override}
        disabled={!!override}
      />

      <Field label="SEO title" name="seoTitle" defaultValue={override?.seoTitle} />
      <div>
        <label htmlFor="metaDescription" className="block text-caption tracking-eyebrow text-taupe uppercase">
          Meta description
        </label>
        <textarea
          id="metaDescription"
          name="metaDescription"
          rows={2}
          defaultValue={override?.metaDescription}
          className="mt-2 w-full rounded-sm border border-taupe/40 bg-white px-3 py-2 text-small text-charcoal"
        />
      </div>
      <Field label="Canonical URL" name="canonicalUrl" defaultValue={override?.canonicalUrl} placeholder="https://www.newbornphotographynpl.com/about/" />

      <fieldset className="border-t border-taupe/20 pt-4">
        <legend className="text-caption font-medium tracking-eyebrow text-taupe uppercase">Open Graph</legend>
        <div className="mt-3 space-y-3">
          <Field label="OG title" name="ogTitle" defaultValue={override?.ogTitle} />
          <Field label="OG description" name="ogDescription" defaultValue={override?.ogDescription} />
          <Field label="OG image URL" name="ogImage" defaultValue={override?.ogImage} />
        </div>
      </fieldset>

      <fieldset className="border-t border-taupe/20 pt-4">
        <legend className="text-caption font-medium tracking-eyebrow text-taupe uppercase">Twitter</legend>
        <div className="mt-3 space-y-3">
          <Field label="Twitter title" name="twitterTitle" defaultValue={override?.twitterTitle} />
          <Field label="Twitter description" name="twitterDescription" defaultValue={override?.twitterDescription} />
          <Field label="Twitter image URL" name="twitterImage" defaultValue={override?.twitterImage} />
        </div>
      </fieldset>

      <div className="flex items-center gap-4 border-t border-taupe/20 pt-4 text-small text-charcoal">
        <label className="flex items-center gap-1">
          <input type="checkbox" name="noindex" defaultChecked={override?.noindex} /> Noindex
        </label>
        <label className="flex items-center gap-1">
          <input type="checkbox" name="nofollow" defaultChecked={override?.nofollow} /> Nofollow
        </label>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-sm bg-plum px-5 py-2.5 text-small font-medium text-white disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        {state.status === "error" && state.message ? <p className="text-caption text-plum">{state.message}</p> : null}
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  required,
  disabled,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-caption tracking-eyebrow text-taupe uppercase">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="mt-2 w-full rounded-sm border border-taupe/40 bg-white px-3 py-2 text-small text-charcoal disabled:bg-blush/20 disabled:text-charcoal/60"
      />
    </div>
  );
}
