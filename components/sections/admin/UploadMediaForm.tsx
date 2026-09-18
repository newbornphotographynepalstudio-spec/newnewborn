"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { uploadMedia, type MediaFormState } from "@/lib/media/library-actions";
import { MEDIA_CATEGORIES } from "@/lib/media/library-types";
import { AdminButton } from "@/components/admin/ui/Button";
import { AdminInput, AdminSelect, FormField } from "@/components/admin/ui/fields";
import { FormMessage } from "@/components/admin/ui/FormMessage";
import { UploadIcon } from "@/components/admin/ui/icons";

const initialState: MediaFormState = { status: "idle" };

/**
 * Same upload architecture as before this redesign — one native <input
 * type="file" multiple>, submitted through the exact same `uploadMedia`
 * Server Action (Supabase Storage + Firestore, concurrent per-file
 * uploads, see lib/media/library-actions.ts — untouched by this
 * redesign). Drag-and-drop here is a pure presentation layer on top of
 * that same input: a dropped file list is assigned to the input's
 * `files` via DataTransfer, so the form still submits exactly the
 * fields the Server Action already expects.
 */
export function UploadMediaForm() {
  const [state, formAction, pending] = useActionState(uploadMedia, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state.status === "success") {
      // formRef.current?.reset() (below) fires a real DOM "reset" event,
      // handled by the form's onReset — that's where fileNames actually
      // clears, so this effect only performs non-React-state work.
      formRef.current?.reset();
      router.refresh();
    }
  }, [state.status, router]);

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    if (fileInputRef.current) fileInputRef.current.files = files;
    setFileNames(Array.from(files).map((f) => f.name));
  }

  return (
    <form ref={formRef} action={formAction} onReset={() => setFileNames([])} className="space-y-5">
      <div>
        <label
          htmlFor="files"
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
            dragActive ? "border-plum bg-plum/5" : "border-slate-300 bg-slate-50/60 hover:border-slate-400"
          }`}
        >
          <UploadIcon width={22} height={22} className="text-slate-400" />
          <p className="mt-3 text-sm font-medium text-slate-700">
            Drag photos here, or <span className="text-plum">browse</span>
          </p>
          <p className="mt-1 text-xs text-slate-500">JPEG, PNG or WebP — up to 20MB each, multiple at once</p>
          {fileNames.length > 0 ? (
            <p className="mt-3 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
              {fileNames.length} file{fileNames.length === 1 ? "" : "s"} selected
            </p>
          ) : null}
          <input
            ref={fileInputRef}
            id="files"
            name="files"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            required
            onChange={(e) => handleFiles(e.target.files)}
            className="sr-only"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Title" htmlFor="title" help="Only used when uploading a single photo.">
          <AdminInput id="title" name="title" type="text" />
        </FormField>
        <FormField label="Category" htmlFor="category">
          <AdminSelect id="category" name="category">
            {MEDIA_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </AdminSelect>
        </FormField>
      </div>

      <FormField
        label="Alt text"
        htmlFor="alt"
        required
        help="Required — a factual description. Used for every photo if uploading multiple."
      >
        <AdminInput
          id="alt"
          name="alt"
          type="text"
          required
          placeholder="Newborn baby wrapped in a grey knit wrap, sleeping on a wooden bed prop."
        />
      </FormField>

      <FormField label="Caption" htmlFor="caption" help="Optional.">
        <AdminInput id="caption" name="caption" type="text" />
      </FormField>

      <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
        <AdminButton type="submit" variant="primary" disabled={pending}>
          {pending ? "Uploading…" : "Upload Photos"}
        </AdminButton>
        {state.status !== "idle" && state.message ? (
          <FormMessage status={state.status === "error" ? "error" : "success"} message={state.message} />
        ) : null}
      </div>
    </form>
  );
}
