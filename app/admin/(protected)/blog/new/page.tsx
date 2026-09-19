import type { Metadata } from "next";

import { PostForm } from "@/components/sections/admin/PostForm";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { listMedia } from "@/lib/media/library-data";

export const metadata: Metadata = {
  title: "New Post",
  robots: { index: false, follow: false },
};

export default async function NewPostPage() {
  const media = await listMedia();
  const libraryImages = media.configured ? media.assets.filter((a) => a.published) : [];

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="New Post" back={{ href: "/admin/blog", label: "All Posts" }} />
      <PostForm libraryImages={libraryImages} />
    </div>
  );
}
