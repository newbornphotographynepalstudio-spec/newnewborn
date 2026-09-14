"use client";

import { useActionState, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { updateMediaMetadata, deleteMedia, type MediaFormState } from "@/lib/media/library-actions";
import { MEDIA_CATEGORIES } from "@/lib/media/library-types";
import type { MediaLibraryAsset } from "@/lib/media/library-types";

const initialState: MediaFormState = { status: "idle" };

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaCard({ asset }: { asset: MediaLibraryAsset }) {
  const [state, formAction, pending] = useActionState(updateMediaMetadata, initialState);
  const [deletePending, startDeleteTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  function handleDelete() {
    if (!window.confirm(`Delete "${asset.title || asset.alt}"? This removes the file permanently.`)) return;
    startDeleteTransition(async () => {
      await deleteMedia(asset.id);
      router.refresh();
    });
  }

  async function handleCopyUrl() {
    try {
      await navigator.clipboard.writeText(asset.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can be blocked (permissions, insecure context) —
      // nothing useful to do beyond leaving the URL selectable in the DOM.
    }
  }

  return (
    <div className="border border-taupe/20 bg-white p-4">
      {/* eslint-disable-next-line @next/next/no-img-element -- admin-only thumbnail, not the optimized public rendering path */}
      <img src={asset.url} alt={asset.alt} className="aspect-square w-full rounded-sm object-cover" />

      <dl className="mt-2 space-y-0.5 text-caption text-charcoal/60">
        {asset.width && asset.height ? (
          <div className="flex justify-between">
            <dt>Dimensions</dt>
            <dd>
              {asset.width} × {asset.height}
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between">
          <dt>Size</dt>
          <dd>{formatBytes(asset.sizeBytes)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Uploaded</dt>
          <dd>{new Date(asset.createdAt).toLocaleDateString()}</dd>
        </div>
      </dl>
      <button
        type="button"
        onClick={handleCopyUrl}
        className="mt-1 text-caption text-plum hover:underline"
      >
        {copied ? "Copied!" : "Copy URL"}
      </button>

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
        <input
          name="caption"
          defaultValue={asset.caption}
          placeholder="Caption (optional)"
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
