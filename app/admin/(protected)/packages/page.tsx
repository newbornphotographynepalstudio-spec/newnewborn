import Link from "next/link";
import type { Metadata } from "next";

import { DeletePackageButton } from "@/components/sections/admin/DeletePackageButton";
import { listPackagesAdmin } from "@/lib/packages/admin-data";

export const metadata: Metadata = {
  title: "Packages",
  robots: { index: false, follow: false },
};

export default async function AdminPackagesPage() {
  const result = await listPackagesAdmin();

  return (
    <div className="mx-auto max-w-5xl px-gutter py-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h2 text-plum">Packages</h1>
          <p className="mt-2xs text-small text-charcoal/70">
            Shown on /packages/ and the homepage. Changes go live immediately.
          </p>
        </div>
        <Link
          href="/admin/packages/new"
          className="rounded-sm bg-plum px-4 py-2 text-small font-medium text-white"
        >
          Add Package
        </Link>
      </div>

      {!result.configured ? (
        <div className="mt-lg border border-dashed border-taupe/40 bg-white p-lg text-small text-taupe">
          Firebase Admin credentials aren&apos;t configured in this environment yet, so packages
          can&apos;t be loaded here. The public site still shows the approved fallback pricing.
        </div>
      ) : result.packages.length === 0 ? (
        <div className="mt-lg border border-dashed border-taupe/40 bg-white p-lg text-small text-taupe">
          No packages in Firestore yet, the public site is showing the original approved
          fallback pricing (Mini/Premium/Luxury). Add a package here to start managing pricing
          from admin.
        </div>
      ) : (
        <div className="mt-lg overflow-x-auto border border-taupe/20 bg-white">
          <table className="w-full min-w-[640px] text-left text-small">
            <thead className="border-b border-taupe/20 text-caption tracking-eyebrow text-taupe uppercase">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {result.packages.map((pkg) => (
                <tr key={pkg.id} className="border-b border-taupe/10 last:border-b-0">
                  <td className="px-4 py-3 text-charcoal/70">{pkg.order}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/packages/${pkg.id}`} className="font-medium text-plum hover:underline">
                      {pkg.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-charcoal/80">{pkg.priceLabel}</td>
                  <td className="px-4 py-3 text-charcoal/80">{pkg.featured ? "Yes" : ""}</td>
                  <td className="px-4 py-3 text-right">
                    <DeletePackageButton id={pkg.id} name={pkg.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
