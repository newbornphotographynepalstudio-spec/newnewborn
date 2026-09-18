import type { Metadata } from "next";

import { PostForm } from "@/components/sections/admin/PostForm";
import { PageHeader } from "@/components/admin/ui/PageHeader";

export const metadata: Metadata = {
  title: "New Post",
  robots: { index: false, follow: false },
};

export default function NewPostPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="New Post" back={{ href: "/admin/blog", label: "All Posts" }} />
      <PostForm />
    </div>
  );
}
