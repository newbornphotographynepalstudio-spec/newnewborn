import "server-only";

import { getAdminFirestore } from "@/lib/firebase/admin";
import { docToPackage } from "@/lib/packages/data";
import type { PackageSummary } from "@/lib/data/packages";

export type AdminPackage = PackageSummary & { order: number };

export type PackageListResult =
  | { configured: true; packages: AdminPackage[] }
  | { configured: false; packages: [] };

/** Admin-only read of every package, in display order, including ones a
 * public getPackages() fallback would never need to know about (order is
 * only meaningful for admin editing/reordering). */
export async function listPackagesAdmin(): Promise<PackageListResult> {
  try {
    const db = getAdminFirestore();
    const snapshot = await db.collection("packages").orderBy("order", "asc").get();
    const packages = snapshot.docs.map((doc) => ({
      ...docToPackage(doc.id, doc.data()),
      order: typeof doc.data().order === "number" ? doc.data().order : 0,
    }));
    return { configured: true, packages };
  } catch (error) {
    console.error("listPackagesAdmin failed (Firebase Admin not configured?):", error);
    return { configured: false, packages: [] };
  }
}

export async function getPackageAdmin(id: string): Promise<AdminPackage | null> {
  try {
    const db = getAdminFirestore();
    const doc = await db.collection("packages").doc(id).get();
    if (!doc.exists) return null;
    return { ...docToPackage(doc.id, doc.data()!), order: typeof doc.data()!.order === "number" ? doc.data()!.order : 0 };
  } catch (error) {
    console.error("getPackageAdmin failed:", error);
    return null;
  }
}
