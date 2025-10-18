// Product Types
export interface Product {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  price: number | string;
  sku: string | null;
  status: string;
  stockQuantity: number;
  lowStockThreshold: number;
  allowBackorder: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  viewCount: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  seller?: {
    id: string;
    username: string;
    email: string;
  };
  images?: ProductImage[];
  categories?: Category[];
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  isPrimary: boolean;
  createdAt: Date | null;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

// Request Types
export interface GetProductsRequest {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  sellerId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface GetCategoriesRequest {
  page?: number;
  limit?: number;
  search?: string;
}

// Response Types
export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductListResponse {
  products: Product[];
  pagination: PaginationResponse;
}

export interface CategoryListResponse {
  categories: Category[];
  pagination: PaginationResponse;
}
