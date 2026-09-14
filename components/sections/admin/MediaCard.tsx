"use client";

import { useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { updateMediaMetadata, deleteMedia, type MediaFormState } from "@/lib/media/library-actions";
import { MEDIA_CATEGORIES } from "@/lib/media/library-types";
import type { MediaLibraryAsset } from "@/lib/media/library-types";

const initialState: MediaFormState = { status: "idle" };

export function MediaCard({ asset }: { asset: MediaLibraryAsset }) {
  const [state, formAction, pending] = useActionState(updateMediaMetadata, initialState);
  const [deletePending, startDeleteTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (!window.confirm(`Delete "${asset.title || asset.alt}"? This removes the file permanently.`)) return;
    startDeleteTransition(async () => {
      await deleteMedia(asset.id);
      router.refresh();
    });
  }

  return (
    <div className="border border-taupe/20 bg-white p-4">
      {/* eslint-disable-next-line @next/next/no-img-element -- admin-only thumbnail, not the optimized public rendering path */}
      <img src={asset.url} alt={asset.alt} className="aspect-square w-full rounded-sm object-cover" />
      <form action={formAction} className="mt-3 space-y-2">
        <input type="hidden" name="id" value={asset.id} />
        <input
          name="title"
          defaultValue={asset.title}
          placeholder="Title"
          className="w-full rounded-sm border border-taupe/40 bg-white px-2 py-1.5 text-caption text-charcoal"
        />
        <input
          name="alt"
          defaultValue={asset.alt}
          required
          placeholder="Alt text"
          className="w-full rounded-sm border border-taupe/40 bg-white px-2 py-1.5 text-caption text-charcoal"
        />
        <select
          name="category"
          defaultValue={asset.category}
          className="w-full rounded-sm border border-taupe/40 bg-white px-2 py-1.5 text-caption text-charcoal"
        >
          {MEDIA_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-3 text-caption text-charcoal">
          <label className="flex items-center gap-1">
            <input type="checkbox" name="featured" defaultChecked={asset.featured} /> Featured
          </label>
          <label className="flex items-center gap-1">
            <input type="checkbox" name="published" defaultChecked={asset.published} /> Published
          </label>
        </div>
        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            type="submit"
            disabled={pending}
            className="rounded-sm bg-plum px-3 py-1.5 text-caption font-medium text-white disabled:opacity-50"
          >
            {pending ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deletePending}
            className="text-caption text-plum hover:underline disabled:opacity-50"
          >
            {deletePending ? "Deleting…" : "Delete"}
          </button>
        </div>
        {state.status === "error" && state.message ? <p className="text-caption text-plum">{state.message}</p> : null}
      </form>
    </div>
  );
}
