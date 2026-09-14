"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { deletePageSeoOverride } from "@/lib/seo/page-overrides-actions";

export function DeletePageSeoButton({ docId, path }: { docId: string; path: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (!window.confirm(`Remove the SEO override for "${path}"? The page reverts to its default metadata.`)) return;
    startTransition(async () => {
      await deletePageSeoOverride(docId, path);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={pending}
      className="text-caption text-plum hover:underline disabled:opacity-50"
    >
      {pending ? "Removing…" : "Remove"}
    </button>
  );
}
