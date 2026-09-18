import { AlertIcon, CheckCircleIcon } from "@/components/admin/ui/icons";

/**
 * Styles the inline success/error text every admin form already
 * produces via useActionState (state.status/state.message) as a small
 * banner instead of a bare paragraph — purely presentational, the
 * underlying status/message the Server Actions return is unchanged.
 */
export function FormMessage({ status, message }: { status: "success" | "error"; message: string }) {
  const isError = status === "error";
  return (
    <p
      role={isError ? "alert" : "status"}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium ${
        isError ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
      }`}
    >
      {isError ? <AlertIcon width={14} height={14} /> : <CheckCircleIcon width={14} height={14} />}
      {message}
    </p>
  );
}
