import type { Metadata } from "next";

import { PackageForm } from "@/components/sections/admin/PackageForm";
import { listPackagesAdmin } from "@/lib/packages/admin-data";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Card } from "@/components/admin/ui/Card";

export const metadata: Metadata = {
  title: "New Package",
  robots: { index: false, follow: false },
};

export default async function NewPackagePage() {
  const result = await listPackagesAdmin();
  const nextOrder = result.configured ? result.packages.length : 0;

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Add Package" back={{ href: "/admin/packages", label: "All Packages" }} />
      <Card className="p-6">
        <PackageForm nextOrder={nextOrder} />
      </Card>
    </div>
  );
}
