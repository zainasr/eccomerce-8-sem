import { eq, like, desc, asc, count } from "drizzle-orm";
import {
  db,
  categories,
  GetCategoriesQuery,
  Category,
  CategoryListResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "shared";

export class CategoryService {
  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    const [newCategory] = await db
      .insert(categories)
      .values(data)
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
    const [updatedCategory] = await db
      .update(categories)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(categories.id, id))
      .returning();

    return updatedCategory;
  }

  async deleteCategory(id: string): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }
}
