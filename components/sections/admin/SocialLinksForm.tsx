"use client";

import { useActionState } from "react";

import { saveSocialLinks, type SettingsFormState } from "@/lib/settings/actions";
import type { SocialLinkEntry } from "@/lib/settings/data";
import { AdminButton } from "@/components/admin/ui/Button";
import { AdminInput, FormField } from "@/components/admin/ui/fields";
import { FormMessage } from "@/components/admin/ui/FormMessage";

const PLATFORMS: { key: SocialLinkEntry["platform"]; label: string }[] = [
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
  { key: "tiktok", label: "TikTok" },
  { key: "youtube", label: "YouTube" },
  { key: "pinterest", label: "Pinterest" },
];

const initialState: SettingsFormState = { status: "idle" };

export function SocialLinksForm({ current }: { current: SocialLinkEntry[] }) {
  const [state, formAction, pending] = useActionState(saveSocialLinks, initialState);
  const byPlatform = Object.fromEntries(current.map((link) => [link.platform, link.href]));

  return (
    <form action={formAction} className="space-y-4">
      {PLATFORMS.map((platform) => (
        <FormField key={platform.key} label={platform.label} htmlFor={`social_${platform.key}`}>
          <AdminInput
            id={`social_${platform.key}`}
            name={`social_${platform.key}`}
            type="url"
            defaultValue={byPlatform[platform.key] ?? ""}
            placeholder={`https://${platform.key}.com/...`}
          />
        </FormField>
      ))}
      <div className="flex items-center gap-4 border-t border-slate-100 pt-4">
        <AdminButton type="submit" variant="primary" disabled={pending}>
          {pending ? "Saving…" : "Save Social Links"}
        </AdminButton>
        {state.status !== "idle" && state.message ? (
          <FormMessage status={state.status === "error" ? "error" : "success"} message={state.message} />
        ) : null}
      </div>
    </form>
  );
}
