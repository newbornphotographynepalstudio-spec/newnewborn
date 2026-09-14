export type BlogPostStatus = "draft" | "published";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImageId?: string;
  author: string;
  status: BlogPostStatus;
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
};

export const DEFAULT_AUTHOR = "Newborn Photography Nepal";
