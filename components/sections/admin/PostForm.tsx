"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { savePost, type PostFormState } from "@/lib/blog/actions";
import type { BlogPost } from "@/lib/blog/types";
import { allGalleryImages } from "@/lib/media/all-images";

const initialState: PostFormState = { status: "idle" };

export function PostForm({ post }: { post?: BlogPost }) {
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

      <Field label="Title" name="title" defaultValue={post?.title} required />
      <Field
        label="URL slug (leave blank to generate from title)"
        name="slug"
        defaultValue={post?.slug}
        placeholder="how-to-prepare-for-a-newborn-session"
      />
      <Field label="Author" name="author" defaultValue={post?.author} placeholder="Newborn Photography Nepal" />

      <div>
        <label htmlFor="excerpt" className="block text-caption tracking-eyebrow text-taupe uppercase">
          Excerpt (short summary shown on the blog list)
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          defaultValue={post?.excerpt}
          className="mt-2 w-full rounded-sm border border-taupe/40 bg-white px-3 py-2 text-small text-charcoal"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-caption tracking-eyebrow text-taupe uppercase">
          Content (plain text, blank line between paragraphs)
        </label>
        <textarea
          id="content"
          name="content"
          rows={14}
          defaultValue={post?.content}
          className="mt-2 w-full rounded-sm border border-taupe/40 bg-white px-3 py-2 text-small text-charcoal"
        />
      </div>

      <div>
        <label htmlFor="featuredImageId" className="block text-caption tracking-eyebrow text-taupe uppercase">
          Featured image
        </label>
        <select
          id="featuredImageId"
          name="featuredImageId"
          defaultValue={post?.featuredImageId ?? ""}
          className="mt-2 w-full rounded-sm border border-taupe/40 bg-white px-3 py-2 text-small text-charcoal"
        >
          <option value="">None</option>
          {allGalleryImages.map((img) => (
            <option key={img.id} value={img.id}>
              {img.title ?? img.id}
            </option>
          ))}
        </select>
        <p className="mt-1 text-caption text-charcoal/50">
          Picks from the studio&apos;s existing approved photography — direct upload isn&apos;t
          available until Firebase Storage is enabled.
        </p>
      </div>

      <fieldset className="border-t border-taupe/20 pt-4">
        <legend className="text-caption font-medium tracking-eyebrow text-taupe uppercase">SEO (optional)</legend>
        <div className="mt-3 space-y-4">
          <Field label="SEO title override" name="seoTitle" defaultValue={post?.seoTitle} />
          <div>
            <label htmlFor="seoDescription" className="block text-caption tracking-eyebrow text-taupe uppercase">
              SEO description override
            </label>
            <textarea
              id="seoDescription"
              name="seoDescription"
              rows={2}
              defaultValue={post?.seoDescription}
              className="mt-2 w-full rounded-sm border border-taupe/40 bg-white px-3 py-2 text-small text-charcoal"
            />
          </div>
        </div>
      </fieldset>

      <div>
        <label htmlFor="status" className="block text-caption tracking-eyebrow text-taupe uppercase">
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={post?.status ?? "draft"}
          className="mt-2 rounded-sm border border-taupe/40 bg-white px-3 py-2 text-small text-charcoal"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-sm bg-plum px-5 py-2.5 text-small font-medium text-white disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save Post"}
        </button>
        {state.status === "error" && state.message ? (
          <p className="text-caption text-plum">{state.message}</p>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-caption tracking-eyebrow text-taupe uppercase">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full rounded-sm border border-taupe/40 bg-white px-3 py-2 text-small text-charcoal"
      />
    </div>
  );
}
