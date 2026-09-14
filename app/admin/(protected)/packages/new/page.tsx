import Link from "next/link";
import type { Metadata } from "next";

import { PackageForm } from "@/components/sections/admin/PackageForm";
import { listPackagesAdmin } from "@/lib/packages/admin-data";

export const metadata: Metadata = {
  title: "New Package",
  robots: { index: false, follow: false },
};

export default async function NewPackagePage() {
  const result = await listPackagesAdmin();
  const nextOrder = result.configured ? result.packages.length : 0;

  return (
    <div className="mx-auto max-w-2xl px-gutter py-2xl">
      <Link href="/admin/packages" className="text-small text-plum hover:underline">
        ← All Packages
      </Link>
      <h1 className="mt-4 text-h2 text-plum">Add Package</h1>
      <div className="mt-8 border border-taupe/20 bg-white p-6">
        <PackageForm nextOrder={nextOrder} />
      </div>
    </div>
  );
}
