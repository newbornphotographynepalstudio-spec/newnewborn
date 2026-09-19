import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { PostForm } from "@/components/sections/admin/PostForm";
import { getPostByIdAdmin } from "@/lib/blog/admin-data";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { listMedia } from "@/lib/media/library-data";

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
  const [post, media] = await Promise.all([getPostByIdAdmin(id), listMedia()]);

  if (!post) {
    notFound();
  }

  const libraryImages = media.configured ? media.assets.filter((a) => a.published) : [];

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title={`Edit ${post.title}`} back={{ href: "/admin/blog", label: "All Posts" }} />
      <PostForm post={post} libraryImages={libraryImages} />
    </div>
  );
}
