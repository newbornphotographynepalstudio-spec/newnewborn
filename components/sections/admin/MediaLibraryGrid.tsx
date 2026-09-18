"use client";

import { useMemo, useState } from "react";

import { MediaCard } from "@/components/sections/admin/MediaCard";
import { MEDIA_CATEGORIES, type MediaLibraryAsset } from "@/lib/media/library-types";
import { AdminInput, AdminSelect } from "@/components/admin/ui/fields";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { SearchIcon } from "@/components/admin/ui/icons";

export function MediaLibraryGrid({ assets }: { assets: MediaLibraryAsset[] }) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return assets.filter((asset) => {
      if (categoryFilter !== "all" && asset.category !== categoryFilter) return false;
      if (!term) return true;
      const haystack = [asset.title, asset.alt, asset.caption].filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(term);
    });
  }, [assets, search, categoryFilter]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <SearchIcon width={16} height={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
          <AdminInput
            type="search"
            placeholder="Search title, alt text, caption…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>
        <AdminSelect
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="w-auto"
        >
          <option value="all">All categories</option>
          {MEDIA_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </AdminSelect>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Showing {filtered.length} of {assets.length}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="No photos match this search/filter" />
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((asset) => (
            <MediaCard key={asset.id} asset={asset} />
          ))}
        </div>
      )}
    </div>
  );
}
