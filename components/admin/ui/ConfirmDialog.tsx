"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { AdminButton } from "@/components/admin/ui/Button";
import { TrashIcon } from "@/components/admin/ui/icons";

/**
 * Replaces the `window.confirm(...)` used by every existing delete
 * button (DeleteFaqButton, DeletePackageButton, DeletePostButton,
 * DeletePageSeoButton, MediaCard's delete) with a real, accessible
 * dialog — same guarantee (a destructive action never fires without an
 * explicit confirm click), better presentation. `onConfirm` is the exact
 * same server-action call each button already made; this component only
 * owns the confirm UI and the pending/refresh choreography around it, so
 * no delete action's actual behavior changes.
 *
 * Every delete action this wraps (deleteFaq/deletePackage/deletePost/
 * deletePageSeoOverride/deleteMedia) resolves with `{status, message}`
 * rather than throwing on failure — so this checks the returned status
 * explicitly rather than relying on try/catch, which would otherwise
 * treat every one of those "graceful" failures as a success and close
 * the dialog anyway.
 *
 * Uses the native <dialog> element (built-in focus trap, Escape-to-
 * close, backdrop, no library) rather than a hand-rolled modal.
 */
export function ConfirmDeleteButton({
  onConfirm,
  itemLabel,
  title,
  description,
  confirmLabel = "Delete",
  triggerLabel = "Delete",
  variant = "row",
}: {
  onConfirm: () => Promise<{ status: string; message?: string } | void>;
  itemLabel: string;
  title?: string;
  description?: string;
  confirmLabel?: string;
  triggerLabel?: string;
  /** "row" = a small inline text-style trigger for table rows/cards;
   * "button" = a full secondary-style button. */
  variant?: "row" | "button";
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function open() {
    setError(null);
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  function handleConfirm() {
    startTransition(async () => {
      try {
        const result = await onConfirm();
        if (result && result.status === "error") {
          setError(result.message ?? "Something went wrong. Please try again.");
          return;
        }
        close();
        router.refresh();
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <>
      {variant === "row" ? (
        <button
          type="button"
          onClick={open}
          className="text-xs font-medium text-red-600 hover:text-red-700 hover:underline"
        >
          {triggerLabel}
        </button>
      ) : (
        <AdminButton variant="danger" size="sm" onClick={open} icon={<TrashIcon width={15} height={15} />}>
          {triggerLabel}
        </AdminButton>
      )}

      <dialog
        ref={dialogRef}
        onCancel={(e) => {
          e.preventDefault();
          if (!pending) close();
        }}
        className="m-auto w-[min(420px,calc(100vw-2rem))] rounded-xl border border-slate-200 bg-white p-0 shadow-lg backdrop:bg-slate-900/40"
      >
        <div className="p-5">
          <h2 className="text-sm font-semibold text-slate-900">{title ?? `Delete "${itemLabel}"?`}</h2>
          <p className="mt-1.5 text-sm text-slate-500">
            {description ?? "This cannot be undone."}
          </p>
          {error ? <p className="mt-2 text-xs font-medium text-red-600">{error}</p> : null}
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-3">
          <AdminButton variant="ghost" size="sm" onClick={close} disabled={pending}>
            Cancel
          </AdminButton>
          <AdminButton variant="danger" size="sm" onClick={handleConfirm} disabled={pending}>
            {pending ? "Deleting…" : confirmLabel}
          </AdminButton>
        </div>
      </dialog>
    </>
  );
}
