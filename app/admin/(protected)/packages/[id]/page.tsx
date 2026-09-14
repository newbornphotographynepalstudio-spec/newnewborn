import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { PackageForm } from "@/components/sections/admin/PackageForm";
import { getPackageAdmin } from "@/lib/packages/admin-data";

export const metadata: Metadata = {
  title: "Edit Package",
  robots: { index: false, follow: false },
};

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pkg = await getPackageAdmin(id);

  if (!pkg) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-gutter py-2xl">
      <Link href="/admin/packages" className="text-small text-plum hover:underline">
        ← All Packages
      </Link>
      <h1 className="mt-4 text-h2 text-plum">Edit {pkg.name}</h1>
      <div className="mt-8 border border-taupe/20 bg-white p-6">
        <PackageForm pkg={pkg} nextOrder={pkg.order} />
      </div>
    </div>
  );
}
