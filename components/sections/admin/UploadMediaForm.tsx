"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { uploadMedia, type MediaFormState } from "@/lib/media/library-actions";
import { MEDIA_CATEGORIES } from "@/lib/media/library-types";

const initialState: MediaFormState = { status: "idle" };

export function UploadMediaForm() {
  const [state, formAction, pending] = useActionState(uploadMedia, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      router.refresh();
    }
  }, [state.status, router]);

  return (
    <form ref={formRef} action={formAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label htmlFor="files" className="block text-caption tracking-eyebrow text-taupe uppercase">
          Photos (JPEG/PNG/WebP, up to 20MB each — select multiple at once if you like)
        </label>
        <input
          id="files"
          name="files"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          required
          className="mt-2 w-full rounded-sm border border-taupe/40 bg-white px-3 py-2 text-small text-charcoal"
        />
      </div>
      <div>
        <label htmlFor="title" className="block text-caption tracking-eyebrow text-taupe uppercase">
          Title (only used when uploading a single photo)
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className="mt-2 w-full rounded-sm border border-taupe/40 bg-white px-3 py-2 text-small text-charcoal"
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-caption tracking-eyebrow text-taupe uppercase">
          Category
        </label>
        <select
          id="category"
          name="category"
          className="mt-2 w-full rounded-sm border border-taupe/40 bg-white px-3 py-2 text-small text-charcoal"
        >
          {MEDIA_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="alt" className="block text-caption tracking-eyebrow text-taupe uppercase">
          Alt text (required — factual description; used for every photo if uploading multiple)
        </label>
        <input
          id="alt"
          name="alt"
          type="text"
          required
          placeholder="Newborn baby wrapped in a grey knit wrap, sleeping on a wooden bed prop."
          className="mt-2 w-full rounded-sm border border-taupe/40 bg-white px-3 py-2 text-small text-charcoal"
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="caption" className="block text-caption tracking-eyebrow text-taupe uppercase">
          Caption (optional)
        </label>
        <input
          id="caption"
          name="caption"
          type="text"
          className="mt-2 w-full rounded-sm border border-taupe/40 bg-white px-3 py-2 text-small text-charcoal"
        />
      </div>
      <div className="sm:col-span-2 flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-sm bg-plum px-5 py-2.5 text-small font-medium text-white disabled:opacity-50"
        >
          {pending ? "Uploading…" : "Upload Photos"}
        </button>
        {state.status !== "idle" && state.message ? (
          <p className={`text-caption ${state.status === "error" ? "text-plum" : "text-taupe"}`}>{state.message}</p>
        ) : null}
      </div>
    </form>
  );
}
