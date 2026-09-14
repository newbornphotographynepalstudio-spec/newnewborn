import Link from "next/link";
import type { Metadata } from "next";

import { PostForm } from "@/components/sections/admin/PostForm";

export const metadata: Metadata = {
  title: "New Post",
  robots: { index: false, follow: false },
};

export default function NewPostPage() {
  return (
    <div className="mx-auto max-w-2xl px-gutter py-2xl">
      <Link href="/admin/blog" className="text-small text-plum hover:underline">
        ← All Posts
      </Link>
      <h1 className="mt-4 text-h2 text-plum">New Post</h1>
      <div className="mt-8 border border-taupe/20 bg-white p-6">
        <PostForm />
      </div>
    </div>
  );
}
