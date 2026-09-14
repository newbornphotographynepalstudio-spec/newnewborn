import Link from "next/link";
import type { Metadata } from "next";

import { DeletePostButton } from "@/components/sections/admin/DeletePostButton";
import { listAllPosts } from "@/lib/blog/admin-data";

export const metadata: Metadata = {
  title: "Blog",
  robots: { index: false, follow: false },
};

export default async function AdminBlogPage() {
  const result = await listAllPosts();

  return (
    <div className="mx-auto max-w-5xl px-gutter py-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h2 text-plum">Blog</h1>
          <p className="mt-2xs text-small text-charcoal/70">
            Published posts appear on /blog/ immediately. Drafts stay private.
          </p>
        </div>
        <Link href="/admin/blog/new" className="rounded-sm bg-plum px-4 py-2 text-small font-medium text-white">
          New Post
        </Link>
      </div>

      {!result.configured ? (
        <div className="mt-lg border border-dashed border-taupe/40 bg-white p-lg text-small text-taupe">
          Firebase Admin credentials aren&apos;t configured in this environment yet, so posts
          can&apos;t be loaded here.
        </div>
      ) : result.posts.length === 0 ? (
        <div className="mt-lg border border-dashed border-taupe/40 bg-white p-lg text-small text-taupe">
          No posts yet. Create the first one to start publishing to /blog/.
        </div>
      ) : (
        <div className="mt-lg overflow-x-auto border border-taupe/20 bg-white">
          <table className="w-full min-w-[640px] text-left text-small">
            <thead className="border-b border-taupe/20 text-caption tracking-eyebrow text-taupe uppercase">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {result.posts.map((post) => (
                <tr key={post.id} className="border-b border-taupe/10 last:border-b-0">
                  <td className="px-4 py-3">
                    <Link href={`/admin/blog/${post.id}`} className="font-medium text-plum hover:underline">
                      {post.title}
                    </Link>
                    <div className="text-caption text-taupe">/blog/{post.slug}/</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-sm px-2 py-1 text-caption font-medium uppercase ${
                        post.status === "published" ? "bg-plum text-white" : "border border-taupe/30 text-taupe"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-charcoal/60">
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DeletePostButton id={post.id} title={post.title} />
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
