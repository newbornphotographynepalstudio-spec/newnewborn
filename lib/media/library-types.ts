export const MEDIA_CATEGORIES = ["newborn", "maternity", "baby", "cake-smash", "family", "other"] as const;
export type MediaLibraryCategory = (typeof MEDIA_CATEGORIES)[number];

export type MediaLibraryAsset = {
  id: string;
  storagePath: string;
  url: string;
  title: string;
  alt: string;
  category: MediaLibraryCategory;
  featured: boolean;
  published: boolean;
  order: number;
  contentType: string;
  sizeBytes: number;
  createdAt: string;
};
