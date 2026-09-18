"use client";

import { useActionState } from "react";

import { saveGlobalSeo, type SettingsFormState } from "@/lib/settings/actions";
import type { GlobalSeoSettings } from "@/lib/settings/data";
import { AdminButton } from "@/components/admin/ui/Button";
import { AdminInput, AdminTextarea, FormField } from "@/components/admin/ui/fields";
import { FormMessage } from "@/components/admin/ui/FormMessage";

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
        <FormField label="Default meta description" htmlFor="defaultDescription">
          <AdminTextarea id="defaultDescription" name="defaultDescription" rows={2} defaultValue={current.defaultDescription} />
        </FormField>
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

      <div className="flex items-center gap-4 border-t border-slate-100 pt-4">
        <AdminButton type="submit" variant="primary" disabled={pending}>
          {pending ? "Saving…" : "Save Global SEO"}
        </AdminButton>
        {state.status !== "idle" && state.message ? (
          <FormMessage status={state.status === "error" ? "error" : "success"} message={state.message} />
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
    <p className="mt-1.5 text-xs text-slate-500">
      {saved ? (
        <>
          <span className="font-medium text-plum">Saved override active</span> — this value is live on the
          public site.
        </>
      ) : (
        <>
          <span className="font-medium text-slate-600">Not overridden.</span> Using code default:{" "}
          <span className="text-slate-700">&quot;{codeDefault}&quot;</span>
        </>
      )}
      {note ? <span className="mt-0.5 block text-slate-400">{note}</span> : null}
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
      <FormField label={label} htmlFor={name}>
        <AdminInput id={name} name={name} type="text" defaultValue={defaultValue} />
      </FormField>
      <FieldStatus saved={defaultValue} codeDefault={codeDefault} note={note} />
    </div>
  );
}
