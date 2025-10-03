import {
  eq,
  and,
  like,
  gte,
  lte,
  desc,
  asc,
  count,
  or,
  sql,
} from "drizzle-orm";
import {
  db,
  products,
  productImages,
  productCategories,
  categories,
  users,
  CreateProductRequest,
  UpdateProductRequest,
  GetProductsQuery,
  Product,
  ProductWithDetails,
  ProductListResponse,
  Category,
  ProductImage,
} from "shared";

function mapDbProductToProduct(row: any): Product {
  return {
    id: row.id,
    sellerId: row.sellerId,
    name: row.name,
    description: row.description,
    price: typeof row.price === "string" ? Number(row.price) : row.price,
    sku: row.sku ?? null,
    status: row.status,
    stockQuantity: row.stockQuantity,
    lowStockThreshold: row.lowStockThreshold,
    allowBackorder: row.allowBackorder,
    seoTitle: row.seoTitle ?? null,
    seoDescription: row.seoDescription ?? null,
    seoKeywords: row.seoKeywords ?? null,
    viewCount: row.viewCount,
    createdAt: row.createdAt ?? null,
    updatedAt: row.updatedAt ?? null,
  };
}

function mapDbImageToImage(row: any): ProductImage {
  return {
    id: row.id,
    productId: row.productId,
    imageUrl: row.imageUrl,
    isPrimary: row.isPrimary,
    createdAt: row.createdAt ?? null,
  };
}

function mapDbCategoryToCategory(row: any): Category {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? null,
    createdAt: row.createdAt ?? null,
    updatedAt: row.updatedAt ?? null,
  };
}

export class ProductService {
  async createProduct(
    data: CreateProductRequest,
    sellerId: string
  ): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values({
        ...data,
        sellerId,
        price: data.price.toString(),
      })
      .returning();

    if (data.categoryIds.length > 0) {
      await db.insert(productCategories).values(
        data.categoryIds.map((categoryId) => ({
          productId: newProduct.id,
          categoryId,
        }))
      );
    }

    return mapDbProductToProduct(newProduct);
  }

  async getProducts(query: GetProductsQuery): Promise<ProductListResponse> {
    const {
      page,
      limit,
      search,
      categoryId,
      minPrice,
      maxPrice,
      status,
      sellerId,
      sortBy,
      sortOrder,
    } = query;
    const offset = (page - 1) * limit;

    const whereConditions: any[] = [];

    if (search) {
      whereConditions.push(
        or(
          like(products.name, `%${search}%`),
          like(products.description, `%${search}%`)
        )
      );
    }

    if (categoryId) {
      whereConditions.push(eq(productCategories.categoryId, categoryId));
    }

    if (minPrice) {
      whereConditions.push(gte(products.price, minPrice.toString()));
    }

    if (maxPrice) {
      whereConditions.push(lte(products.price, maxPrice.toString()));
    }

    if (status) {
      whereConditions.push(eq(products.status, status));
    }

    if (sellerId) {
      whereConditions.push(eq(products.sellerId, sellerId));
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const orderColumn =
      sortBy === "name"
        ? products.name
        : sortBy === "price"
        ? products.price
        : sortBy === "viewCount"
        ? products.viewCount
        : products.createdAt;

    const productsQuery = db
      .select()
      .from(products)
      .leftJoin(productCategories, eq(products.id, productCategories.productId))
      .where(whereClause)
      .orderBy(sortOrder === "asc" ? asc(orderColumn) : desc(orderColumn))
      .limit(limit)
      .offset(offset);

    const [productsResult, totalCount] = await Promise.all([
      productsQuery,
      db.select({ count: count() }).from(products).where(whereClause),
    ]);

    return {
      products: productsResult.map((row) =>
        mapDbProductToProduct(row.products)
      ),
      pagination: {
        page,
        limit,
        total: Number(totalCount[0]?.count || 0),
        totalPages: Math.ceil(Number(totalCount[0]?.count || 0) / limit),
      },
    };
  }

  async getProductById(id: string): Promise<ProductWithDetails | null> {
    const [result] = await db
      .select()
      .from(products)
      .leftJoin(users, eq(products.sellerId, users.id))
      .where(eq(products.id, id))
      .limit(1);

    if (!result) return null;

    const imagesRows = await db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, id));

    const productCategoriesResult = await db
      .select()
      .from(productCategories)
      .leftJoin(categories, eq(productCategories.categoryId, categories.id))
      .where(eq(productCategories.productId, id));

    const images = imagesRows.map(mapDbImageToImage);
    const cats = productCategoriesResult
      .map((row) =>
        row.categories ? mapDbCategoryToCategory(row.categories) : null
      )
      .filter((c): c is Category => Boolean(c));

    const base = mapDbProductToProduct(result.products);

    return {
      ...base,
      seller: result.users
        ? {
            id: result.users.id,
            username: result.users.username,
            email: result.users.email,
          }
        : { id: "", username: "", email: "" },
      images,
      categories: cats,
    };
  }

  async updateProduct(
    id: string,
    data: UpdateProductRequest,
    sellerId: string
  ): Promise<Product> {
    const [existingProduct] = await db
      .select()
      .from(products)
      .where(and(eq(products.id, id), eq(products.sellerId, sellerId)))
      .limit(1);

    if (!existingProduct) {
      throw new Error("Product not found or access denied");
    }

    const updateData: any = { ...data };
    if (data.price !== undefined) updateData.price = data.price.toString();

    const [updatedProduct] = await db
      .update(products)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();

    if (data.categoryIds) {
      await db
        .delete(productCategories)
        .where(eq(productCategories.productId, id));
      if (data.categoryIds.length > 0) {
        await db.insert(productCategories).values(
          data.categoryIds.map((categoryId) => ({
            productId: id,
            categoryId,
          }))
        );
      }
    }

    return mapDbProductToProduct(updatedProduct);
  }

  async deleteProduct(id: string, sellerId: string): Promise<void> {
    const [existingProduct] = await db
      .select()
      .from(products)
      .where(and(eq(products.id, id), eq(products.sellerId, sellerId)))
      .limit(1);

    if (!existingProduct) {
      throw new Error("Product not found or access denied");
    }

    await db.delete(products).where(eq(products.id, id));
  }

  async updateStock(productId: string, quantity: number): Promise<void> {
    await db
      .update(products)
      .set({ stockQuantity: quantity, updatedAt: new Date() })
      .where(eq(products.id, productId));
  }

  async incrementViewCount(productId: string): Promise<void> {
    await db
      .update(products)
      .set({ viewCount: sql`${products.viewCount} + 1`, updatedAt: new Date() })
      .where(eq(products.id, productId));
  }
}
