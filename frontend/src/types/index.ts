// User & Auth Types
export type UserRole = 'buyer' |  'admin';
export type UserStatus = 'pending' | 'active' | 'suspended';

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  status: UserStatus;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  profilePicture: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  data: {
    user: User;
    profile: UserProfile;
    
  };
}

// Product Types
export type ProductStatus = 'draft' | 'active' | 'archived';

export interface ProductImage {
  // id: string;
  createdAt: string;
  id: string;
  imageUrl: string;
  isPrimary: boolean;
  productId: string;



}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  sellerId: string;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  stockQuantity: number;
  status: ProductStatus;
  viewCount: number;
  sku: string;
  lowStockThreshold: number;
  allowBackorder: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  createdAt: string;
  updatedAt: string;
  primaryImage:string|null;
  images?: ProductImage[];
  categories: Category[];
  seller?: {
    username: string;
    profile: UserProfile;
  };
}

// Cart Types
export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  price: string;
  
  createdAt: string;
  updatedAt: string;
 
}

export interface Cart {
  id: string;
  userId: string;
  createdAt: string;
  slug: string;
  updatedAt: string;
  items: CartItem[];
}

// Order Types
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: string;
  createdAt: string;

}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  status: OrderStatus;
  totalAmount: string;
  shippingAddress: string | null;
  notes:string | null
  createdAt: string;
  updatedAt: string;
  buyer:{
    id:string,
    username:string,
    email:string
  }
  items: OrderItem[];

  seller?: {
    id:string,
    username: string;
    email: string;
  };
}

export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  userId: string;
  stripePaymentIntentId: string;
  amount: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

// Blog Types
export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  status: "draft" | "published";
  authorId?: string;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetProductsQuery {
  page:string,
  limit: string,
  search: string | null,
  categoryId: string | null,
  minPrice: string | null,
  maxPrice: string | null,
  status: ProductStatus | null,
  sellerId: string | null,
  inStock: string | null,
  sortBy: string,
  sortOrder: string,
}