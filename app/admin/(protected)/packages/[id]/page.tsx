import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { PackageForm } from "@/components/sections/admin/PackageForm";
import { getPackageAdmin } from "@/lib/packages/admin-data";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Card } from "@/components/admin/ui/Card";

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
    <div className="mx-auto max-w-2xl">
      <PageHeader title={`Edit ${pkg.name}`} back={{ href: "/admin/packages", label: "All Packages" }} />
      <Card className="p-6">
        <PackageForm pkg={pkg} nextOrder={pkg.order} />
      </Card>
    </div>
  );
}
