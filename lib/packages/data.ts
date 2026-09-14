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
