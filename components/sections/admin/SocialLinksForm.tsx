"use client";

import { useActionState } from "react";

import { saveSocialLinks, type SettingsFormState } from "@/lib/settings/actions";
import type { SocialLinkEntry } from "@/lib/settings/data";

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
        <div key={platform.key}>
          <label htmlFor={`social_${platform.key}`} className="block text-caption tracking-eyebrow text-taupe uppercase">
            {platform.label}
          </label>
          <input
            id={`social_${platform.key}`}
            name={`social_${platform.key}`}
            type="url"
            defaultValue={byPlatform[platform.key] ?? ""}
            placeholder={`https://${platform.key}.com/...`}
            className="mt-2 w-full rounded-sm border border-taupe/40 bg-white px-3 py-2 text-small text-charcoal"
          />
        </div>
      ))}
      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-sm bg-plum px-5 py-2.5 text-small font-medium text-white disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save Social Links"}
        </button>
        {state.status !== "idle" && state.message ? (
          <p className={`text-caption ${state.status === "error" ? "text-plum" : "text-taupe"}`}>{state.message}</p>
        ) : null}
      </div>
    </form>
  );
}
