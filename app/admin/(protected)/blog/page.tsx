import Link from "next/link";
import type { Metadata } from "next";

import { listAllPosts } from "@/lib/blog/admin-data";
import { deletePost } from "@/lib/blog/actions";
import { formatDate } from "@/lib/utils/format-date";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { AdminButton } from "@/components/admin/ui/Button";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { Table, TableHead, Th, TableBody, Tr, Td } from "@/components/admin/ui/Table";
import { Badge } from "@/components/admin/ui/Badge";
import { ConfirmDeleteButton } from "@/components/admin/ui/ConfirmDialog";
import { BlogIcon, PlusIcon } from "@/components/admin/ui/icons";

export const metadata: Metadata = {
  title: "Blog",
  robots: { index: false, follow: false },
};

export default async function AdminBlogPage() {
  const result = await listAllPosts();

  return (
    <div>
      <PageHeader
        title="Blog"
        description="Published posts appear on /blog/ immediately. Drafts stay private."
        action={
          <AdminButton href="/admin/blog/new" variant="primary" icon={<PlusIcon width={15} height={15} />}>
            New Post
          </AdminButton>
        }
      />

      {!result.configured ? (
        <EmptyState
          icon={<BlogIcon width={28} height={28} />}
          title="Firebase Admin credentials aren't configured"
          description="Posts can't be loaded here."
        />
      ) : result.posts.length === 0 ? (
        <EmptyState
          icon={<BlogIcon width={28} height={28} />}
          title="No posts yet"
          description="Create the first one to start publishing to /blog/."
          action={
            <AdminButton href="/admin/blog/new" variant="primary">
              New Post
            </AdminButton>
          }
        />
      ) : (
        <Table minWidth={560}>
          <TableHead>
            <Th>Title</Th>
            <Th>Status</Th>
            <Th>Updated</Th>
            <Th className="text-right">Actions</Th>
          </TableHead>
          <TableBody>
            {result.posts.map((post) => (
              <Tr key={post.id}>
                <Td>
                  <Link href={`/admin/blog/${post.id}`} className="font-medium text-plum hover:underline">
                    {post.title}
                  </Link>
                  <div className="mt-0.5 text-xs text-slate-400">/blog/{post.slug}/</div>
                </Td>
                <Td>
                  <Badge tone={post.status === "published" ? "success" : "neutral"}>{post.status}</Badge>
                </Td>
                <Td className="text-slate-500">{formatDate(post.updatedAt)}</Td>
                <Td className="text-right">
                  <ConfirmDeleteButton itemLabel={post.title} onConfirm={deletePost.bind(null, post.id)} />
                </Td>
              </Tr>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
