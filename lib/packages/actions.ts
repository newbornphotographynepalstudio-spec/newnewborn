"use server";

import { revalidatePath } from "next/cache";

import { getAdminFirestore } from "@/lib/firebase/admin";
import { verifyAdminSession } from "@/lib/firebase/session";
import { routes } from "@/lib/navigation/routes";

export type PackageFormState = { status: "idle" | "success" | "error"; message?: string };

function readString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readIncludes(formData: FormData): string[] {
  const raw = readString(formData, "includes");
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function revalidatePublicPackagePages() {
  revalidatePath(routes.packages);
  revalidatePath(routes.home);
  revalidatePath("/admin/packages");
}

/** Creates or updates a package document. Requires a valid admin session,
 * checked independently of whatever page/action called this, since a
 * Server Action is its own callable endpoint (see updateInquiryStatus for
 * the same reasoning already established in this codebase). */
export async function savePackage(
  _prevState: PackageFormState,
  formData: FormData
): Promise<PackageFormState> {
  const session = await verifyAdminSession();
  if (!session) {
    return { status: "error", message: "Your session has expired. Please sign in again." };
  }

  const id = readString(formData, "id");
  const name = readString(formData, "name");
  const tagline = readString(formData, "tagline");
  const priceRaw = readString(formData, "price");
  const priceLabel = readString(formData, "priceLabel");
  const duration = readString(formData, "duration");
  const setups = readString(formData, "setups");
  const editedPhotos = readString(formData, "editedPhotos");
  const includes = readIncludes(formData);
  const featured = formData.get("featured") === "on";
  const orderRaw = readString(formData, "order");

  const price = Number.parseInt(priceRaw, 10);
  const order = Number.parseInt(orderRaw, 10);

  if (!name || !priceLabel || !duration || Number.isNaN(price)) {
    return { status: "error", message: "Please fill in name, price and duration." };
  }

  const data = {
    name,
    tagline,
    price,
    priceLabel,
    duration,
    setups,
    editedPhotos,
    includes,
    href: routes.bookASession,
    featured,
    order: Number.isNaN(order) ? 0 : order,
  };

  try {
    const db = getAdminFirestore();
    if (id) {
      await db.collection("packages").doc(id).set(data, { merge: true });
    } else {
      await db.collection("packages").add(data);
    }
    revalidatePublicPackagePages();
    return { status: "success", message: "Package saved." };
  } catch (error) {
    console.error("savePackage failed:", error);
    return { status: "error", message: "Couldn't save the package. Please try again." };
  }
}

export async function deletePackage(id: string): Promise<PackageFormState> {
  const session = await verifyAdminSession();
  if (!session) {
    return { status: "error", message: "Your session has expired. Please sign in again." };
  }
  try {
    const db = getAdminFirestore();
    await db.collection("packages").doc(id).delete();
    revalidatePublicPackagePages();
    return { status: "success", message: "Package deleted." };
  } catch (error) {
    console.error("deletePackage failed:", error);
    return { status: "error", message: "Couldn't delete the package. Please try again." };
  }
}
