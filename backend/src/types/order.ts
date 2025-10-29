import { z } from "zod";

// Enums
export const orderStatuses = [
  "pending",
  "confirmed", 
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded"
] as const;

export type OrderStatus = (typeof orderStatuses)[number];

// Cart Schemas
export const addToCartSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export const removeFromCartSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
});

// Order Schemas
export const createOrderSchema = z.object({
  shippingAddress: z.string().min(10, "Shipping address is required"),
  notes: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(orderStatuses),
  notes: z.string().optional(),
});

// Query Schemas
export const getCartQuerySchema = z.object({
  includeProductDetails: z.string().transform(val => val === 'true').optional(),
});

export const getOrdersQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().int().min(1)).default("1"),
  limit: z
    .string()
    .transform(Number)
    .pipe(z.number().int().min(1).max(100))
    .default("10"),
  status: z.enum(orderStatuses).optional(),
  sortBy: z
    .enum(["createdAt", "totalAmount", "status"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Type Interfaces
export interface Cart {
  id: string;
  userId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  items?: CartItem[];
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  price: number | string;
  createdAt: Date | null;
  updatedAt: Date | null;
  product?: {
    id: string;
    name: string;
    description: string;
    price: number | string;
    images?: Array<{
      id: string;
      imageUrl: string;
      isPrimary: boolean;
    }>;
  };
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  status: OrderStatus | string;
  totalAmount: number | string;
  shippingAddress: string;
  notes: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  buyer?: {
    id: string;
    username: string;
    email: string;
  };
  seller?: {
    id: string;
    username: string;
    email: string;
  };
  items?: OrderItem[];
  statusHistory?: OrderStatusHistory[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number | string;
  createdAt: Date | null;
  product?: {
    id: string;
    name: string;
    description: string;
    images?: Array<{
      id: string;
      imageUrl: string;
      isPrimary: boolean;
    }>;
  };
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  status: OrderStatus | string;
  notes: string | null;
  createdAt: Date | null;
}

export interface OrderListResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CartResponse {
  cart: Cart;
  totalItems: number;
  totalAmount: number;
}

// Type exports
export type AddToCartRequest = z.infer<typeof addToCartSchema>;
export type UpdateCartItemRequest = z.infer<typeof updateCartItemSchema>;
export type RemoveFromCartRequest = z.infer<typeof removeFromCartSchema>;
export type CreateOrderRequest = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusRequest = z.infer<typeof updateOrderStatusSchema>;
export type GetCartQuery = z.infer<typeof getCartQuerySchema>;
export type GetOrdersQuery = z.infer<typeof getOrdersQuerySchema>;
