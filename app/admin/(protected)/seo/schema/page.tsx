import type { Metadata } from "next";

import { getPublishedPosts } from "@/lib/blog/data";
import { getFaqs } from "@/lib/faq/data";
import {
  blogPostingJsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
  organizationJsonLd,
  professionalServiceJsonLd,
  websiteJsonLd,
} from "@/lib/seo/jsonld";
import { routes } from "@/lib/navigation/routes";
import { getSiteSettings } from "@/lib/settings/data";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Card } from "@/components/admin/ui/Card";

export const metadata: Metadata = {
  title: "Schema Inspector",
  robots: { index: false, follow: false },
};

/** Every block below is the exact same function call the real public
 * page makes — this is not a mockup or an approximation of the site's
 * structured data, it's the actual generated output, computed live. */
export default async function AdminSchemaPage() {
  const { seo, socialLinks } = await getSiteSettings();
  const faqs = await getFaqs();
  const posts = await getPublishedPosts();
  const samplePost = posts[0];

  const blocks: { label: string; page: string; jsonLd: object }[] = [
    { label: "Organization", page: "/ (homepage)", jsonLd: organizationJsonLd(seo.organizationName, socialLinks) },
    { label: "WebSite", page: "/ (homepage)", jsonLd: websiteJsonLd() },
    { label: "ProfessionalService", page: "/ (homepage)", jsonLd: professionalServiceJsonLd(undefined, seo.organizationName) },
    {
      label: "BreadcrumbList",
      page: routes.portfolioNewborn,
      jsonLd: breadcrumbJsonLd([
        { name: "Portfolio", href: routes.portfolio },
        { name: "Newborn", href: routes.portfolioNewborn },
      ]),
    },
    { label: "FAQPage", page: routes.faq, jsonLd: faqPageJsonLd(faqs) },
  ];

  if (samplePost) {
    blocks.push({
      label: "BlogPosting",
      page: `${routes.blog}${samplePost.slug}/`,
      jsonLd: blogPostingJsonLd(samplePost),
    });
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Schema Inspector"
        description="The actual structured data currently generated on real pages, computed live from the same code the public site runs — not a preview or a mockup."
      />
      {!samplePost ? (
        <p className="mb-4 text-xs text-slate-500">
          No published blog post exists yet, so BlogPosting schema isn&apos;t shown below — publish one to see
          it here.
        </p>
      ) : null}

      <div className="space-y-4">
        {blocks.map((block) => (
          <Card key={block.label} className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-plum">{block.label}</h2>
              <span className="text-xs text-slate-400">{block.page}</span>
            </div>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-200">
              {JSON.stringify(block.jsonLd, null, 2)}
            </pre>
          </Card>
        ))}
      </div>
    </div>
  );
}
