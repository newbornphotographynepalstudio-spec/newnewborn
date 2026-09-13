/**
 * Package/pricing data — Firebase-ready shape, deliberately empty until
 * real packages and pricing exist. No price, inclusion or tier name is
 * invented here (see Phase 3 placeholder policy); `PackagesPreview`
 * renders an honest "coming soon" state when this array is empty, the
 * same pattern used by SocialLinks/GalleryGrid for missing content.
 */
export type PackageSummary = {
  id: string;
  name: string;
  tagline: string;
  priceFrom?: string;
  href: string;
};

export const packages: PackageSummary[] = [];
