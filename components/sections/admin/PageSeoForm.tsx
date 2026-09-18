"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { savePageSeoOverride, type PageSeoFormState } from "@/lib/seo/page-overrides-actions";
import type { PageSeoOverride } from "@/lib/seo/page-overrides";
import { AdminButton } from "@/components/admin/ui/Button";
import { AdminCheckbox, AdminInput, AdminTextarea, FormField } from "@/components/admin/ui/fields";
import { FormMessage } from "@/components/admin/ui/FormMessage";
import { SectionCard } from "@/components/admin/ui/Card";

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
    <form action={formAction} className="space-y-6">
      {/* Disabled inputs never submit their value — a hidden field carries
          the real path when editing, since the path itself can't change
          (it's the document's identity). */}
      {override ? <input type="hidden" name="path" value={override.path} /> : null}

      <SectionCard title="Page">
        <div className="space-y-4">
          <FormField label="Page path" htmlFor={override ? "pathDisplay" : "path"} required={!override}>
            <AdminInput
              id={override ? "pathDisplay" : "path"}
              name={override ? "pathDisplay" : "path"}
              type="text"
              defaultValue={override?.path ?? initialPath}
              placeholder="/about/"
              required={!override}
              disabled={!!override}
            />
          </FormField>
          <FormField label="SEO title" htmlFor="seoTitle">
            <AdminInput id="seoTitle" name="seoTitle" type="text" defaultValue={override?.seoTitle} />
          </FormField>
          <FormField label="Meta description" htmlFor="metaDescription">
            <AdminTextarea id="metaDescription" name="metaDescription" rows={2} defaultValue={override?.metaDescription} />
          </FormField>
          <FormField label="Canonical URL" htmlFor="canonicalUrl">
            <AdminInput
              id="canonicalUrl"
              name="canonicalUrl"
              type="text"
              defaultValue={override?.canonicalUrl}
              placeholder="https://www.newbornphotographynpl.com/about/"
            />
          </FormField>
        </div>
      </SectionCard>

      <SectionCard title="Open Graph">
        <div className="space-y-4">
          <FormField label="OG title" htmlFor="ogTitle">
            <AdminInput id="ogTitle" name="ogTitle" type="text" defaultValue={override?.ogTitle} />
          </FormField>
          <FormField label="OG description" htmlFor="ogDescription">
            <AdminInput id="ogDescription" name="ogDescription" type="text" defaultValue={override?.ogDescription} />
          </FormField>
          <FormField label="OG image URL" htmlFor="ogImage">
            <AdminInput id="ogImage" name="ogImage" type="text" defaultValue={override?.ogImage} />
          </FormField>
        </div>
      </SectionCard>

      <SectionCard title="Twitter">
        <div className="space-y-4">
          <FormField label="Twitter title" htmlFor="twitterTitle">
            <AdminInput id="twitterTitle" name="twitterTitle" type="text" defaultValue={override?.twitterTitle} />
          </FormField>
          <FormField label="Twitter description" htmlFor="twitterDescription">
            <AdminInput id="twitterDescription" name="twitterDescription" type="text" defaultValue={override?.twitterDescription} />
          </FormField>
          <FormField label="Twitter image URL" htmlFor="twitterImage">
            <AdminInput id="twitterImage" name="twitterImage" type="text" defaultValue={override?.twitterImage} />
          </FormField>
        </div>
      </SectionCard>

      <SectionCard title="Indexing">
        <div className="flex items-center gap-6">
          <AdminCheckbox name="noindex" defaultChecked={override?.noindex} label="Noindex" />
          <AdminCheckbox name="nofollow" defaultChecked={override?.nofollow} label="Nofollow" />
        </div>
      </SectionCard>

      <div className="flex items-center gap-4">
        <AdminButton type="submit" variant="primary" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </AdminButton>
        {state.status === "error" && state.message ? <FormMessage status="error" message={state.message} /> : null}
      </div>
    </form>
  );
}
