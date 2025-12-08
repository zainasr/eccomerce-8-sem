import { z } from "zod";

export const blogStatusEnum = z.enum(["draft", "published"]);

export const createBlogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1).optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().url().optional(),
  status: blogStatusEnum.default("draft"),
});

export const updateBlogSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content is required").optional(),
  coverImage: z.string().url().optional().nullable(),
  status: blogStatusEnum.optional(),
});

export const listBlogsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: blogStatusEnum.optional(),
  search: z.string().optional(),
});

export type CreateBlogRequest = z.infer<typeof createBlogSchema>;
export type UpdateBlogRequest = z.infer<typeof updateBlogSchema>;
export type ListBlogsQuery = z.infer<typeof listBlogsQuerySchema>;

