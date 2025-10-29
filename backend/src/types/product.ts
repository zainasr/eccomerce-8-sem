import { z } from "zod";

// Enums
export const productStatuses = ["draft", "active", "inactive"] as const;
export const stockStatuses = ["in_stock", "out_of_stock", "backorder"] as const;

export type ProductStatus = (typeof productStatuses)[number];
export type StockStatus = (typeof stockStatuses)[number];

// Category Schemas
export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Name too long"),
  description: z.string().optional(),
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Name too long")
    .optional(),
  description: z.string().optional(),
});

// Product Schemas
export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required").max(200, "Name too long"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be positive"),
  sku: z.string().max(100, "SKU too long").optional(),
  status: z.enum(productStatuses).default("draft"),
  stockQuantity: z
    .number()
    .int()
    .min(0, "Stock quantity cannot be negative")
    .default(0),
  lowStockThreshold: z
    .number()
    .int()
    .min(0, "Low stock threshold cannot be negative")
    .default(5),
  allowBackorder: z.boolean().default(false),
  seoTitle: z.string().max(200, "SEO title too long").optional(),
  seoDescription: z.string().max(300, "SEO description too long").optional(),
  seoKeywords: z.string().max(500, "SEO keywords too long").optional(),
  images: z
    .array(z.string().url("Invalid image URL").max(500, "URL too long"))
    .optional(),
  categoryIds: z
    .array(z.string().uuid("Invalid category ID"))
    .min(1, "At least one category is required"),
});
export const updateProductSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(200, "Name too long")
    .optional(),
  description: z.string().min(1, "Description is required").optional(),
  price: z.number().positive("Price must be positive").optional(),
  sku: z.string().max(100, "SKU too long").optional(),
  status: z.enum(productStatuses).optional(),
  stockQuantity: z
    .number()
    .int()
    .min(0, "Stock quantity cannot be negative")
    .optional(),
  lowStockThreshold: z
    .number()
    .int()
    .min(0, "Low stock threshold cannot be negative")
    .optional(),
  allowBackorder: z.boolean().optional(),
  seoTitle: z.string().max(200, "SEO title too long").optional(),
  seoDescription: z.string().max(300, "SEO description too long").optional(),
  seoKeywords: z.string().max(500, "SEO keywords too long").optional(),
  images: z
    .array(z.string().url("Invalid image URL").max(500, "URL too long"))
    .optional(),
  categoryIds: z.array(z.string().uuid("Invalid category ID")).optional(),
});



export const getProductsQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().int().min(1)).default("1"),
  limit: z
    .string()
    .transform(Number)
    .pipe(z.number().int().min(1).max(100))
    .default("10"),
  search: z.string().optional(),
  // FIX: Accept comma-separated category IDs and transform to array
  categoryId: z
    .string()
    .transform((val) => val.split(',').filter(id => id.trim()))
    .pipe(z.array(z.string().uuid("Invalid category ID")))
    .optional(),
  minPrice: z.string().transform(Number).pipe(z.number().positive()).optional(),
  maxPrice: z.string().transform(Number).pipe(z.number().positive()).optional(),
  status: z.enum(productStatuses).optional(),
  sellerId: z.string().uuid("Invalid seller ID").optional(),
  inStock: z.string().transform(val => val === 'true').optional(),
  sortBy: z
    .enum(["name", "price", "createdAt", "viewCount", ""])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});


export const getCategoriesQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().int().min(1)).default("1"),
  limit: z
    .string()
    .transform(Number)
    .pipe(z.number().int().min(1).max(100))
    .default("10"),
  search: z.string().optional(),
});


export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  isPrimary: boolean;
  createdAt: Date | null;
}

export interface Product {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  price: number | string;
  sku: string | null;
  status: ProductStatus | string;
  stockQuantity: number;
  lowStockThreshold: number;
  allowBackorder: boolean;
  seoTitle: string | null;
  slug: string;
  seoDescription: string | null;
  seoKeywords: string | null;
  viewCount: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  // Relations
  seller?: {
    id: string;
    username: string;
    email: string;
  };
  images?: ProductImage[];
  categories?: Category[];
}

export interface ProductWithDetails extends Product {
  images: ProductImage[];
  categories: Category[];
  seller: {
    id: string;
    username: string;
    email: string;
  };
}

export interface ProductListResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CategoryListResponse {
  categories: Category[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Type exports
export type CreateCategoryRequest = z.infer<typeof createCategorySchema>;
export type UpdateCategoryRequest = z.infer<typeof updateCategorySchema>;
export type CreateProductRequest = z.infer<typeof createProductSchema>;
export type UpdateProductRequest = z.infer<typeof updateProductSchema>;

export type GetProductsQuery = z.infer<typeof getProductsQuerySchema>;
export type GetCategoriesQuery = z.infer<typeof getCategoriesQuerySchema>;
