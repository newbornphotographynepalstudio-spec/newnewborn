"use client";

import { useActionState } from "react";

import { saveGlobalSeo, type SettingsFormState } from "@/lib/settings/actions";
import type { GlobalSeoSettings } from "@/lib/settings/data";

const initialState: SettingsFormState = { status: "idle" };

export function GlobalSeoForm({ current, defaults }: { current: GlobalSeoSettings; defaults: { siteName: string; tagline: string; description: string } }) {
  const [state, formAction, pending] = useActionState(saveGlobalSeo, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <Field
        label="Site name"
        name="siteName"
        defaultValue={current.siteName}
        codeDefault={defaults.siteName}
        note="Used in every page's browser-tab title suffix and Open Graph site name."
      />
      <Field
        label="Tagline"
        name="tagline"
        defaultValue={current.tagline}
        codeDefault={defaults.tagline}
        note="Not currently visible on any live page — every page sets its own explicit title, so this only feeds a fallback template no route actually uses."
      />
      <div>
        <label htmlFor="defaultDescription" className="block text-caption tracking-eyebrow text-taupe uppercase">
          Default meta description
        </label>
        <textarea
          id="defaultDescription"
          name="defaultDescription"
          rows={2}
          defaultValue={current.defaultDescription}
          className="mt-2 w-full rounded-sm border border-taupe/40 bg-white px-3 py-2 text-small text-charcoal"
        />
        <FieldStatus
          saved={current.defaultDescription}
          codeDefault={defaults.description}
          note="Only reached by a page with no description of its own, e.g. an invalid /blog/ post URL — every other page sets its own."
        />
      </div>
      <Field
        label="Default OG image URL"
        name="defaultOgImage"
        defaultValue={current.defaultOgImage}
        codeDefault="/photography/culture1.jpg"
        note="The actual share-preview image on every page that doesn't have its own dedicated photo — that's currently every page except the homepage."
      />
      <Field
        label="Organization name (structured data)"
        name="organizationName"
        defaultValue={current.organizationName}
        codeDefault={defaults.siteName}
        note="Used in the Organization/ProfessionalService structured data (JSON-LD) on the homepage — see Schema Inspector."
      />

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

/**
 * Shows, in plain text (not just a pale HTML `placeholder`, which reads
 * ambiguously — found live in Phase 16: a fully empty field's code
 * default rendered as a normal-looking placeholder, which could pass
 * for a saved value at a glance), whether this field is currently
 * overridden or using the code default, and what the code default
 * actually is. The input's own `defaultValue`/blank-means-default
 * behavior is unchanged — this is purely an explanatory addition.
 */
function FieldStatus({ saved, codeDefault, note }: { saved?: string; codeDefault: string; note?: string }) {
  return (
    <p className="mt-1.5 text-caption text-charcoal/60">
      {saved ? (
        <>
          <span className="font-medium text-plum">Saved override active</span> — this value is
          live on the public site.
        </>
      ) : (
        <>
          <span className="font-medium">Not overridden.</span> Using code default:{" "}
          <span className="text-charcoal/80">&quot;{codeDefault}&quot;</span>
        </>
      )}
      {note ? <span className="block text-charcoal/50">{note}</span> : null}
    </p>
  );
}

function Field({
  label,
  name,
  defaultValue,
  codeDefault,
  note,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  codeDefault: string;
  note?: string;
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
        className="mt-2 w-full rounded-sm border border-taupe/40 bg-white px-3 py-2 text-small text-charcoal"
      />
      <FieldStatus saved={defaultValue} codeDefault={codeDefault} note={note} />
    </div>
  );
}
