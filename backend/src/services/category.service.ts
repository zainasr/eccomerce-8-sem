import { asc, count, eq, like } from "drizzle-orm";
import { db } from "../database/connection";
import { categories } from "../database/schemas/product";
import {
  Category,
  CategoryListResponse,
  CreateCategoryRequest,
  GetCategoriesQuery,
  UpdateCategoryRequest,
} from "../types/product";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100);
}

async function ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const existing = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);
    
    if (existing.length === 0 || (excludeId && existing[0].id === excludeId)) {
      return slug;
    }
    
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

export class CategoryService {
  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    const baseSlug = generateSlug(data.name);
    const slug = await ensureUniqueSlug(baseSlug);
    
    const [newCategory] = await db
      .insert(categories)
      .values({ ...data, slug })
      .returning();

    return newCategory;
  }

  async getCategories(query: GetCategoriesQuery): Promise<CategoryListResponse> {
    const { page, limit, search } = query;
    const offset = (page - 1) * limit;

    let whereClause;
    if (search) {
      whereClause = like(categories.name, `%${search}%`);
    }

    const [categoriesResult, totalCount] = await Promise.all([
      db
        .select()
        .from(categories)
        .where(whereClause)
        .orderBy(asc(categories.name))
        .limit(limit)
        .offset(offset),
      db.select({ count: count() }).from(categories).where(whereClause),
    ]);

    return {
      categories: categoriesResult,
      pagination: {
        page,
        limit,
        total: totalCount[0]?.count || 0,
        totalPages: Math.ceil((totalCount[0]?.count || 0) / limit),
      },
    };
  }

  async getCategoryById(id: string): Promise<Category | null> {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);

    return category || null;
  }

  async updateCategory(id: string, data: UpdateCategoryRequest): Promise<Category> {
    const updateData: any = { ...data, updatedAt: new Date() };
    
    if (data.name) {
      const baseSlug = generateSlug(data.name);
      updateData.slug = await ensureUniqueSlug(baseSlug, id);
    }
    
    const [updatedCategory] = await db
      .update(categories)
      .set(updateData)
      .where(eq(categories.id, id))
      .returning();

    return updatedCategory;
  }

  async deleteCategory(id: string): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }
}
