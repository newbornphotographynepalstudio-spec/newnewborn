"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { deleteFaq } from "@/lib/faq/actions";

export function DeleteFaqButton({ id, question }: { id: string; question: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (!window.confirm(`Delete "${question}"? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteFaq(id);
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
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
