"use client";

import { useActionState } from "react";

import { saveGlobalSeo, type SettingsFormState } from "@/lib/settings/actions";
import type { GlobalSeoSettings } from "@/lib/settings/data";

const initialState: SettingsFormState = { status: "idle" };

export function GlobalSeoForm({ current, defaults }: { current: GlobalSeoSettings; defaults: { siteName: string; tagline: string; description: string } }) {
  const [state, formAction, pending] = useActionState(saveGlobalSeo, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <Field label="Site name" name="siteName" defaultValue={current.siteName} placeholder={defaults.siteName} />
      <Field label="Tagline" name="tagline" defaultValue={current.tagline} placeholder={defaults.tagline} />
      <div>
        <label htmlFor="defaultDescription" className="block text-caption tracking-eyebrow text-taupe uppercase">
          Default meta description
        </label>
        <textarea
          id="defaultDescription"
          name="defaultDescription"
          rows={2}
          defaultValue={current.defaultDescription}
          placeholder={defaults.description}
          className="mt-2 w-full rounded-sm border border-taupe/40 bg-white px-3 py-2 text-small text-charcoal"
        />
      </div>
      <Field label="Default OG image URL" name="defaultOgImage" defaultValue={current.defaultOgImage} placeholder="/photography/culture1.jpg" />
      <Field label="Organization name (structured data)" name="organizationName" defaultValue={current.organizationName} placeholder={defaults.siteName} />

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-sm bg-plum px-5 py-2.5 text-small font-medium text-white disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save Global SEO"}
        </button>
        {state.status !== "idle" && state.message ? (
          <p className={`text-caption ${state.status === "error" ? "text-plum" : "text-taupe"}`}>{state.message}</p>
        ) : null}
      </div>
    </form>
  );
}

function Field({ label, name, defaultValue, placeholder }: { label: string; name: string; defaultValue?: string; placeholder?: string }) {
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
        className="mt-2 w-full rounded-sm border border-taupe/40 bg-white px-3 py-2 text-small text-charcoal"
      />
    </div>
  );
}
