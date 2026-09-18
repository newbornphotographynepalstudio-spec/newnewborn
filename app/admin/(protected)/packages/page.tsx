import Link from "next/link";
import type { Metadata } from "next";

import { listPackagesAdmin } from "@/lib/packages/admin-data";
import { deletePackage } from "@/lib/packages/actions";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { AdminButton } from "@/components/admin/ui/Button";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { Table, TableHead, Th, TableBody, Tr, Td } from "@/components/admin/ui/Table";
import { Badge } from "@/components/admin/ui/Badge";
import { ConfirmDeleteButton } from "@/components/admin/ui/ConfirmDialog";
import { PackageIcon, PlusIcon } from "@/components/admin/ui/icons";

export const metadata: Metadata = {
  title: "Packages",
  robots: { index: false, follow: false },
};

export default async function AdminPackagesPage() {
  const result = await listPackagesAdmin();

  return (
    <div>
      <PageHeader
        title="Packages"
        description="Shown on /packages/ and the homepage. Changes go live immediately."
        action={
          <AdminButton href="/admin/packages/new" variant="primary" icon={<PlusIcon width={15} height={15} />}>
            Add Package
          </AdminButton>
        }
      />

      {!result.configured ? (
        <EmptyState
          icon={<PackageIcon width={28} height={28} />}
          title="Firebase Admin credentials aren't configured"
          description="Packages can't be loaded here. The public site still shows the approved fallback pricing."
        />
      ) : result.packages.length === 0 ? (
        <EmptyState
          icon={<PackageIcon width={28} height={28} />}
          title="No packages in Firestore yet"
          description="The public site is showing the original approved fallback pricing (Mini/Premium/Luxury). Add a package here to start managing pricing from admin."
          action={
            <AdminButton href="/admin/packages/new" variant="primary">
              Add Package
            </AdminButton>
          }
        />
      ) : (
        <Table minWidth={560}>
          <TableHead>
            <Th>Order</Th>
            <Th>Name</Th>
            <Th>Price</Th>
            <Th>Featured</Th>
            <Th className="text-right">Actions</Th>
          </TableHead>
          <TableBody>
            {result.packages.map((pkg) => (
              <Tr key={pkg.id}>
                <Td className="text-slate-400">{pkg.order}</Td>
                <Td>
                  <Link href={`/admin/packages/${pkg.id}`} className="font-medium text-plum hover:underline">
                    {pkg.name}
                  </Link>
                </Td>
                <Td>{pkg.priceLabel}</Td>
                <Td>{pkg.featured ? <Badge tone="accent">Featured</Badge> : null}</Td>
                <Td className="text-right">
                  <ConfirmDeleteButton itemLabel={pkg.name} onConfirm={deletePackage.bind(null, pkg.id)} />
                </Td>
              </Tr>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
