"use client";

import { useMemo, useState } from "react";

import { MediaCard } from "@/components/sections/admin/MediaCard";
import { MEDIA_CATEGORIES, type MediaLibraryAsset } from "@/lib/media/library-types";

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
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Search title, alt text, caption…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="min-w-[220px] flex-1 rounded-sm border border-taupe/40 bg-white px-3 py-2 text-small text-charcoal"
        />
        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="rounded-sm border border-taupe/40 bg-white px-3 py-2 text-small text-charcoal"
        >
          <option value="all">All categories</option>
          {MEDIA_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-3 text-caption text-charcoal/60">
        Showing {filtered.length} of {assets.length}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-4 border border-dashed border-taupe/40 bg-white p-lg text-small text-taupe">
          No photos match this search/filter.
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
