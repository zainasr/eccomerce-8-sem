import {
  and,
  asc,
  count,
  desc,
  eq,
  gte,
  like,
  lte,
  or,
  sql,
} from "drizzle-orm";
import { db } from "../database/connection";
import { users } from "../database/schemas/auth";
import { categories, productCategories, productImages, products } from "../database/schemas/product";
import {
  Category,
  CreateProductRequest,

  GetProductsQuery,
  Product,

  ProductImage,

  ProductListResponse,

  ProductWithDetails,
  UpdateProductRequest,
} from "../types/product";

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

    // Ensure at least one image exists for the product
    const defaultImages = [
      "https://images.unsplash.com/photo-1512446816042-444d6412674f",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    ];

    const imagesToInsert = (data as any).images as string[] | undefined;

    if (imagesToInsert && imagesToInsert.length > 0) {
      // Insert provided images, mark the first as primary
      await db.insert(productImages).values(
        imagesToInsert.map((url, idx) => ({
          productId: newProduct.id,
          imageUrl: url,
          isPrimary: idx === 0,
        }))
      );
    } else {
      // Insert a default placeholder image
      const fallbackUrl =
        defaultImages[Math.floor(Math.random() * defaultImages.length)];
      await db.insert(productImages).values({
        productId: newProduct.id,
        imageUrl: fallbackUrl,
        isPrimary: true,
      });
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
    // Verify product exists and belongs to seller
    const [existingProduct] = await db
      .select()
      .from(products)
      .where(and(eq(products.id, id), eq(products.sellerId, sellerId)))
      .limit(1);

    if (!existingProduct) {
      console.log(
        `[UPDATE PRODUCT] Product not found or access denied for ID: ${id}`
      );
      throw new Error("Product not found or access denied");
    }

    console.log(
      `[UPDATE PRODUCT] Found existing product: ${existingProduct.name}`
    );

    // Separate images from other product data (images are handled separately)
    const { images, categoryIds, ...productData } = data as any;

    // Build update object with only provided fields
    const updateData: any = {};

    // Only include fields that are actually provided in the request
    if (productData.name !== undefined) updateData.name = productData.name;
    if (productData.description !== undefined)
      updateData.description = productData.description;
    if (productData.price !== undefined) {
      updateData.price = productData.price.toString();
      console.log(`[UPDATE PRODUCT] Updating price: ${productData.price}`);
    }
    if (productData.sku !== undefined) updateData.sku = productData.sku;
    if (productData.status !== undefined)
      updateData.status = productData.status;
    if (productData.stockQuantity !== undefined)
      updateData.stockQuantity = productData.stockQuantity;
    if (productData.lowStockThreshold !== undefined)
      updateData.lowStockThreshold = productData.lowStockThreshold;
    if (productData.allowBackorder !== undefined)
      updateData.allowBackorder = productData.allowBackorder;
    if (productData.seoTitle !== undefined)
      updateData.seoTitle = productData.seoTitle;
    if (productData.seoDescription !== undefined)
      updateData.seoDescription = productData.seoDescription;
    if (productData.seoKeywords !== undefined)
      updateData.seoKeywords = productData.seoKeywords;

    // Always update the timestamp
    updateData.updatedAt = new Date();

    console.log(
      `[UPDATE PRODUCT] Product data to update:`,
      JSON.stringify(updateData, null, 2)
    );

    // Update product if there's data to update
    let updatedProduct = existingProduct;
    if (Object.keys(updateData).length > 1) {
      // More than just updatedAt
      const [result] = await db
        .update(products)
        .set(updateData)
        .where(eq(products.id, id))
        .returning();

      if (result) {
        updatedProduct = result;
        console.log(`[UPDATE PRODUCT] Product updated successfully`);
      }
    } else {
      console.log(
        `[UPDATE PRODUCT] No product fields to update, skipping product table update`
      );
    }

    // Handle category updates (if provided)
    if (categoryIds !== undefined) {
      console.log(`[UPDATE PRODUCT] Updating categories:`, categoryIds);

      // Delete existing category associations
      await db
        .delete(productCategories)
        .where(eq(productCategories.productId, id));

      // Insert new category associations if any
      if (categoryIds.length > 0) {
        const categoryInserts = categoryIds.map((categoryId: string) => ({
          productId: id,
          categoryId,
        }));

        await db.insert(productCategories).values(categoryInserts);
        console.log(
          `[UPDATE PRODUCT] Inserted ${categoryIds.length} category associations`
        );
      } else {
        console.log(
          `[UPDATE PRODUCT] No categories provided, removed all category associations`
        );
      }
    } else {
      console.log(`[UPDATE PRODUCT] No category changes provided`);
    }

    // Handle image updates (if provided)
    if (images !== undefined) {
      console.log(`[UPDATE PRODUCT] Updating images:`, images);

      if (images.length > 0) {
        // Delete existing images
        await db.delete(productImages).where(eq(productImages.productId, id));
        console.log(`[UPDATE PRODUCT] Deleted existing images`);

        // Insert new images
        const imageInserts = images.map((url: string, idx: number) => ({
          productId: id,
          imageUrl: url,
          isPrimary: idx === 0,
        }));

        await db.insert(productImages).values(imageInserts);
        console.log(`[UPDATE PRODUCT] Inserted ${images.length} new images`);
      } else {
        console.log(
          `[UPDATE PRODUCT] Empty images array provided, removing all images`
        );
        await db.delete(productImages).where(eq(productImages.productId, id));
      }
    } else {
      console.log(`[UPDATE PRODUCT] No image changes provided`);
    }

    console.log(
      `[UPDATE PRODUCT] Update completed successfully for product ID: ${id}`
    );
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
    try {
      await db
        .update(products)
        .set({ viewCount: sql`${products.viewCount} + 1`, updatedAt: new Date() })
        .where(eq(products.id, productId));
    } catch (error) {
      console.log("error : ", error);
    }
  }

  async getSellerProducts(sellerId: string, page = 1, limit = 10): Promise<ProductListResponse> {
    const offset = (page - 1) * limit;

    // Get products with their primary images and categories
    const productsQuery = db
      .select({
        products,
        images: productImages,
        categories
      })
      .from(products)
      .where(eq(products.sellerId, sellerId))
      .leftJoin(
        productImages,
        and(
          eq(products.id, productImages.productId),
          eq(productImages.isPrimary, true)
        )
      )
      .leftJoin(
        productCategories,
        eq(products.id, productCategories.productId)
      )
      .leftJoin(
        categories,
        eq(productCategories.categoryId, categories.id)
      )
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const countQuery = db
      .select({ count: count() })
      .from(products)
      .where(eq(products.sellerId, sellerId));

    const [productsResult, [totalCount]] = await Promise.all([
      productsQuery,
      countQuery
    ]);

    // Process results to combine categories for each product
    const productMap = new Map<string, any>();

    productsResult.forEach(row => {
      if (!productMap.has(row.products.id)) {
        productMap.set(row.products.id, {
          ...mapDbProductToProduct(row.products),
          primaryImage: row.images?.imageUrl || null,
          categories: row.categories ? [mapDbCategoryToCategory(row.categories)] : []
        });
      } else if (row.categories) {
        const product = productMap.get(row.products.id);
        if (!product.categories.find((c: Category) => c.id === row.categories?.id)) {
          product.categories.push(mapDbCategoryToCategory(row.categories));
        }
      }
    });

    return {
      products: Array.from(productMap.values()),
      pagination: {
        page,
        limit,
        total: Number(totalCount?.count || 0),
        totalPages: Math.ceil(Number(totalCount?.count || 0) / limit),
      },
    };
  }
}
