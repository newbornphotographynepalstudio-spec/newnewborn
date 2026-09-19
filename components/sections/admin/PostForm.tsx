"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { savePost, type PostFormState } from "@/lib/blog/actions";
import type { BlogPost } from "@/lib/blog/types";
import { areas } from "@/lib/data/areas";
import { getServicePages } from "@/lib/data/service-pages";
import { allGalleryImages } from "@/lib/media/all-images";
import type { MediaLibraryAsset } from "@/lib/media/library-types";
import { AdminButton } from "@/components/admin/ui/Button";
import { AdminInput, AdminSelect, AdminTextarea, FormField } from "@/components/admin/ui/fields";
import { FormMessage } from "@/components/admin/ui/FormMessage";
import { SectionCard } from "@/components/admin/ui/Card";

const initialState: PostFormState = { status: "idle" };
const servicePages = getServicePages();

export function PostForm({
  post,
  libraryImages = [],
}: {
  post?: BlogPost;
  /** Real, published Media Library photos (SEO Phase 11) — offered
   * alongside the static newborn/cake-smash galleries so a post can
   * reference an uploaded photo (e.g. a real maternity photo) as its
   * featured image. */
  libraryImages?: MediaLibraryAsset[];
}) {
  const [state, formAction, pending] = useActionState(savePost, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.status === "success") {
      router.push("/admin/blog");
      router.refresh();
    }
  }, [state.status, router]);

  return (
    <form action={formAction} className="space-y-6">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}

      <SectionCard title="Basics">
        <div className="space-y-4">
          <FormField label="Title" htmlFor="title" required>
            <AdminInput id="title" name="title" defaultValue={post?.title} required />
          </FormField>
          <FormField label="URL slug" htmlFor="slug" help="Leave blank to generate from title.">
            <AdminInput
              id="slug"
              name="slug"
              defaultValue={post?.slug}
              placeholder="how-to-prepare-for-a-newborn-session"
            />
          </FormField>
          <FormField label="Author" htmlFor="author">
            <AdminInput id="author" name="author" defaultValue={post?.author} placeholder="Newborn Photography Nepal" />
          </FormField>
        </div>
      </SectionCard>

      <SectionCard title="Content">
        <div className="space-y-4">
          <FormField label="Excerpt" htmlFor="excerpt" help="Short summary shown on the blog list.">
            <AdminTextarea id="excerpt" name="excerpt" rows={2} defaultValue={post?.excerpt} />
          </FormField>
          <FormField label="Content" htmlFor="content" help="Plain text, blank line between paragraphs.">
            <AdminTextarea id="content" name="content" rows={14} defaultValue={post?.content} />
          </FormField>
        </div>
      </SectionCard>

      <SectionCard title="Featured Image">
        <FormField label="Featured image" htmlFor="featuredImageId">
          <AdminSelect id="featuredImageId" name="featuredImageId" defaultValue={post?.featuredImageId ?? ""}>
            <option value="">None</option>
            <optgroup label="Approved Photography">
              {allGalleryImages.map((img) => (
                <option key={img.id} value={img.id}>
                  {img.title ?? img.id}
                </option>
              ))}
            </optgroup>
            {libraryImages.length > 0 ? (
              <optgroup label="Uploaded Photography">
                {libraryImages.map((img) => (
                  <option key={img.id} value={img.id}>
                    {img.title || img.alt}
                  </option>
                ))}
              </optgroup>
            ) : null}
          </AdminSelect>
        </FormField>
        <p className="mt-2 text-xs text-slate-500">
          Picks from the studio&apos;s existing approved photography, plus any published photo from{" "}
          <Link href="/admin/media" className="text-plum hover:underline">
            Media Library
          </Link>
          .
        </p>
      </SectionCard>

      <SectionCard
        title="Related Content"
        description="Optional — powers one genuinely relevant internal link on the article itself, and the article's schema.org articleSection."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Related service" htmlFor="relatedServiceSlug">
            <AdminSelect id="relatedServiceSlug" name="relatedServiceSlug" defaultValue={post?.relatedServiceSlug ?? ""}>
              <option value="">None</option>
              {Object.values(servicePages).map((service) => (
                <option key={service.slug} value={service.slug}>
                  {service.name}
                </option>
              ))}
            </AdminSelect>
          </FormField>
          <FormField label="Related area" htmlFor="relatedAreaSlug">
            <AdminSelect id="relatedAreaSlug" name="relatedAreaSlug" defaultValue={post?.relatedAreaSlug ?? ""}>
              <option value="">None</option>
              {Object.values(areas).map((area) => (
                <option key={area.slug} value={area.slug}>
                  {area.name}
                </option>
              ))}
            </AdminSelect>
          </FormField>
        </div>
      </SectionCard>

      <SectionCard title="SEO" description="Optional — leave blank to use the post's title/excerpt.">
        <div className="space-y-4">
          <FormField label="SEO title override" htmlFor="seoTitle">
            <AdminInput id="seoTitle" name="seoTitle" defaultValue={post?.seoTitle} />
          </FormField>
          <FormField label="SEO description override" htmlFor="seoDescription">
            <AdminTextarea id="seoDescription" name="seoDescription" rows={2} defaultValue={post?.seoDescription} />
          </FormField>
        </div>
      </SectionCard>

      <SectionCard title="Publish">
        <FormField label="Status" htmlFor="status">
          <AdminSelect id="status" name="status" defaultValue={post?.status ?? "draft"} className="w-48">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </AdminSelect>
        </FormField>
      </SectionCard>

      <div className="flex items-center gap-4">
        <AdminButton type="submit" variant="primary" disabled={pending}>
          {pending ? "Saving…" : "Save Post"}
        </AdminButton>
        {state.status === "error" && state.message ? <FormMessage status="error" message={state.message} /> : null}
      </div>
    </form>
  );
}
