"use client";

import { useActionState, useState } from "react";

import { updateMediaMetadata, deleteMedia, type MediaFormState } from "@/lib/media/library-actions";
import { MEDIA_CATEGORIES } from "@/lib/media/library-types";
import type { MediaLibraryAsset } from "@/lib/media/library-types";
import { formatDate } from "@/lib/utils/format-date";
import { Card } from "@/components/admin/ui/Card";
import { AdminButton } from "@/components/admin/ui/Button";
import { AdminCheckbox, AdminInput, AdminSelect } from "@/components/admin/ui/fields";
import { FormMessage } from "@/components/admin/ui/FormMessage";
import { ConfirmDeleteButton } from "@/components/admin/ui/ConfirmDialog";
import { CheckCircleIcon, CopyIcon } from "@/components/admin/ui/icons";

const initialState: MediaFormState = { status: "idle" };

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaCard({ asset }: { asset: MediaLibraryAsset }) {
  const [state, formAction, pending] = useActionState(updateMediaMetadata, initialState);
  const [copied, setCopied] = useState(false);

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
    <Card className="overflow-hidden p-3">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element -- admin-only thumbnail, not the optimized public rendering path */}
        <img src={asset.url} alt={asset.alt} className="aspect-square w-full rounded-lg object-cover" />
        <div className="absolute top-2 left-2 flex gap-1.5">
          {asset.featured ? (
            <span className="rounded-full bg-plum px-2 py-0.5 text-[10px] font-medium text-white shadow-sm">
              Featured
            </span>
          ) : null}
          {!asset.published ? (
            <span className="rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] font-medium text-white shadow-sm">
              Unpublished
            </span>
          ) : null}
        </div>
      </div>

      <dl className="mt-2.5 space-y-0.5 text-xs text-slate-500">
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
          <dd>{formatDate(asset.createdAt)}</dd>
        </div>
      </dl>
      <button
        type="button"
        onClick={handleCopyUrl}
        className="mt-1.5 flex items-center gap-1 text-xs font-medium text-plum hover:underline"
      >
        {copied ? <CheckCircleIcon width={13} height={13} /> : <CopyIcon width={13} height={13} />}
        {copied ? "Copied!" : "Copy URL"}
      </button>

      <form action={formAction} className="mt-3 space-y-2 border-t border-slate-100 pt-3">
        <input type="hidden" name="id" value={asset.id} />
        <AdminInput name="title" defaultValue={asset.title} placeholder="Title" className="py-1.5 text-xs" />
        <AdminInput
          name="alt"
          defaultValue={asset.alt}
          required
          placeholder="Alt text"
          className="py-1.5 text-xs"
        />
        <AdminInput
          name="caption"
          defaultValue={asset.caption}
          placeholder="Caption (optional)"
          className="py-1.5 text-xs"
        />
        <AdminSelect name="category" defaultValue={asset.category} className="py-1.5 text-xs">
          {MEDIA_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </AdminSelect>
        <div className="flex items-center gap-4 pt-1">
          <AdminCheckbox name="featured" defaultChecked={asset.featured} label="Featured" className="text-xs" />
          <AdminCheckbox name="published" defaultChecked={asset.published} label="Published" className="text-xs" />
        </div>
        <div className="flex items-center justify-between gap-2 pt-1.5">
          <AdminButton type="submit" variant="primary" size="sm" disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </AdminButton>
          <ConfirmDeleteButton
            itemLabel={asset.title || asset.alt}
            description="This removes the file permanently from Supabase Storage."
            onConfirm={() => deleteMedia(asset.id)}
          />
        </div>
        {state.status === "error" && state.message ? <FormMessage status="error" message={state.message} /> : null}
      </form>
    </Card>
  );
}
