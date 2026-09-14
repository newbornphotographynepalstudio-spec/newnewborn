import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { PostForm } from "@/components/sections/admin/PostForm";
import { getPostByIdAdmin } from "@/lib/blog/admin-data";

export const metadata: Metadata = {
  title: "Edit Post",
  robots: { index: false, follow: false },
};

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostByIdAdmin(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-gutter py-2xl">
      <Link href="/admin/blog" className="text-small text-plum hover:underline">
        ← All Posts
      </Link>
      <h1 className="mt-4 text-h2 text-plum">Edit {post.title}</h1>
      <div className="mt-8 border border-taupe/20 bg-white p-6">
        <PostForm post={post} />
      </div>
    </div>
  );
}
