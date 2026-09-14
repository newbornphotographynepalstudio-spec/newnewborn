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

export const metadata: Metadata = {
  title: "Schema Inspector",
  robots: { index: false, follow: false },
};

/** Every block below is the exact same function call the real public
 * page makes — this is not a mockup or an approximation of the site's
 * structured data, it's the actual generated output, computed live. */
export default async function AdminSchemaPage() {
  const { seo } = await getSiteSettings();
  const faqs = await getFaqs();
  const posts = await getPublishedPosts();
  const samplePost = posts[0];

  const blocks: { label: string; page: string; jsonLd: object }[] = [
    { label: "Organization", page: "/ (homepage)", jsonLd: organizationJsonLd(seo.organizationName) },
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
    <div className="mx-auto max-w-4xl px-gutter py-2xl">
      <h1 className="text-h2 text-plum">Schema Inspector</h1>
      <p className="mt-2xs text-small text-charcoal/70">
        The actual structured data currently generated on real pages, computed live from the
        same code the public site runs — not a preview or a mockup.
      </p>
      {!samplePost ? (
        <p className="mt-2 text-caption text-taupe">
          No published blog post exists yet, so BlogPosting schema isn&apos;t shown below —
          publish one to see it here.
        </p>
      ) : null}

      <div className="mt-lg space-y-6">
        {blocks.map((block) => (
          <div key={block.label} className="border border-taupe/20 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-small font-medium text-plum">{block.label}</h2>
              <span className="text-caption text-taupe">{block.page}</span>
            </div>
            <pre className="mt-3 overflow-x-auto rounded-sm bg-blush/20 p-4 text-caption text-charcoal">
              {JSON.stringify(block.jsonLd, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
