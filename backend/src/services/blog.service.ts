import { and, desc, eq, sql, or, ilike } from "drizzle-orm";
import { db } from "../database/connection";
import { blogs, users } from "../database/schemas";
import {
  CreateBlogRequest,
  UpdateBlogRequest,
  ListBlogsQuery,
} from "../types/blog";
import { slugify } from "../utils/slug";

export class BlogService {
  private async buildUniqueSlug(base: string, currentId?: string) {
    const candidate = slugify(base);
    let slugValue = candidate || "post";
    let suffix = 0;

    while (true) {
      const slugToCheck = suffix > 0 ? `${slugValue}-${suffix}` : slugValue;
      const whereClauses = [eq(blogs.slug, slugToCheck)];
      if (currentId) {
        whereClauses.push(sql`${blogs.id} != ${currentId}`);
      }
      const existing = await db
        .select({ id: blogs.id })
        .from(blogs)
        .where(and(...whereClauses))
        .limit(1);
      if (existing.length === 0) {
        return slugToCheck;
      }
      suffix += 1;
    }
  }

  async createBlog(data: CreateBlogRequest, authorId: string) {
    const [author] = await db.select().from(users).where(eq(users.id, authorId)).limit(1);
    if (!author) {
      throw new Error("Author not found");
    }

    const slug = await this.buildUniqueSlug(data.slug || data.title);
    const publishedAt = data.status === "published" ? new Date() : null;

    const [created] = await db
      .insert(blogs)
      .values({
        title: data.title,
        slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage,
        status: data.status || "draft",
        authorId,
        publishedAt,
      })
      .returning();

    return created;
  }

  async updateBlog(id: string, data: UpdateBlogRequest) {
    const [existing] = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1);
    if (!existing) {
      throw new Error("Blog not found");
    }

    let slug = existing.slug;
    if (data.slug || data.title) {
      slug = await this.buildUniqueSlug(data.slug || data.title || existing.title, id);
    }

    const publishedAt =
      data.status === "published"
        ? existing.publishedAt || new Date()
        : data.status === "draft"
        ? null
        : existing.publishedAt;

    const [updated] = await db
      .update(blogs)
      .set({
        title: data.title ?? existing.title,
        slug,
        excerpt: data.excerpt ?? existing.excerpt,
        content: data.content ?? existing.content,
        coverImage: data.coverImage === null ? null : data.coverImage ?? existing.coverImage,
        status: data.status ?? existing.status,
        publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(blogs.id, id))
      .returning();

    return updated;
  }

  async deleteBlog(id: string) {
    const [existing] = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1);
    if (!existing) {
      throw new Error("Blog not found");
    }
    await db.delete(blogs).where(eq(blogs.id, id));
  }

  async getBlogById(id: string) {
    const [blog] = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1);
    if (!blog) {
      throw new Error("Blog not found");
    }
    return blog;
  }

  async listBlogs(query: ListBlogsQuery) {
    const { page = 1, limit = 10, status, search } = query;
    const offset = (page - 1) * limit;

    const whereClauses: any[] = [];
    if (status) whereClauses.push(eq(blogs.status, status as string));
    if (search) {
      const term = `%${search}%`;
      whereClauses.push(or(ilike(blogs.title, term as string), ilike(blogs.excerpt, term as string)));
    }

    const whereCondition = whereClauses.length
      ? and(...whereClauses)
      : undefined;

    const items = await db
      .select()
      .from(blogs)
      .where(whereCondition)
      .orderBy(desc(blogs.publishedAt), desc(blogs.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db
      .select({ total: sql<number>`count(*)` })
      .from(blogs)
      .where(whereCondition);

    return {
      blogs: items,
      pagination: {
        page,
        limit,
        total: Number(total),
        totalPages: Math.ceil(Number(total) / limit),
      },
    };
  }

  async listPublishedBlogs(query: ListBlogsQuery) {
    const { page = 1, limit = 10, search } = query;
    const offset = (page - 1) * limit;

    const whereClauses = [eq(blogs.status, "published")];
    if (search) {
      const term = `%${search}%`;
      whereClauses.push(
        sql`${blogs.title} ILIKE ${'%' + term + '%'} OR ${blogs.excerpt} ILIKE ${'%' + term + '%'}`
      );
    }

    const whereCondition = and(...whereClauses);

    const items = await db
      .select()
      .from(blogs)
      .where(whereCondition)
      .orderBy(desc(blogs.publishedAt), desc(blogs.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db
      .select({ total: sql<number>`count(*)` })
      .from(blogs)
      .where(whereCondition);

    return {
      blogs: items,
      pagination: {
        page,
        limit,
        total: Number(total),
        totalPages: Math.ceil(Number(total) / limit),
      },
    };
  }

  async getPublishedBlogBySlug(slug: string) {
    const [blog] = await db
      .select()
      .from(blogs)
      .where(and(eq(blogs.slug, slug), eq(blogs.status, "published")))
      .limit(1);
    if (!blog) {
      throw new Error("Blog not found");
    }
    return blog;
  }
}

