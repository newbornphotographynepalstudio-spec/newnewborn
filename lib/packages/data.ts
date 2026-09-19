import "server-only";

import { getAdminFirestore } from "@/lib/firebase/admin";
import { newbornPackages, type PackageSummary } from "@/lib/data/packages";

/**
 * Public read: packages shown on /packages/ and the homepage preview.
 * Reads from the `packages` Firestore collection (admin-editable) when it
 * has documents; falls back to the original hardcoded, client-approved
 * data in lib/data/packages.ts whenever Firestore is empty, unreachable,
 * or credentials aren't configured — the site must never show a broken
 * or empty packages section just because the CMS layer isn't set up yet.
 * `next: { revalidate: 60 }` keeps a public page from hitting Firestore
 * on every single request while still picking up admin edits quickly.
 */
export async function getPackages(): Promise<PackageSummary[]> {
  try {
    const db = getAdminFirestore();
    const snapshot = await db.collection("packages").orderBy("order", "asc").get();
    if (snapshot.empty) {
      return newbornPackages;
    }
    return snapshot.docs.map((doc) => docToPackage(doc.id, doc.data()));
  } catch (error) {
    console.error("getPackages failed, falling back to static data:", error);
    return newbornPackages;
  }
}

/**
 * A `priceRange` string for schema.org (ProfessionalService), computed
 * from whatever packages actually exist right now — never a hardcoded
 * figure, so an admin-edited price is reflected here automatically and
 * this can never drift from what's really published on /packages/. Real
 * lowest/highest across the current package set, formatted the same way
 * NPR prices already are elsewhere on the site (e.g. `priceLabel`).
 */
export function formatPriceRange(packages: PackageSummary[]): string | undefined {
  if (packages.length === 0) return undefined;
  const prices = packages.map((p) => p.price).filter((p) => typeof p === "number" && p > 0);
  if (prices.length === 0) return undefined;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const format = (n: number) => `NPR ${n.toLocaleString("en-US")}`;
  return min === max ? format(min) : `${format(min)}–${format(max)}`;
}

export function docToPackage(id: string, data: FirebaseFirestore.DocumentData): PackageSummary {
  return {
    id,
    name: data.name,
    tagline: data.tagline,
    price: data.price,
    priceLabel: data.priceLabel,
    duration: data.duration,
    setups: data.setups,
    editedPhotos: data.editedPhotos,
    includes: Array.isArray(data.includes) ? data.includes : [],
    href: data.href,
    featured: data.featured === true,
  };
}
