import { z } from "zod";

// Validation Schemas
export const getUsersQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().int().min(1)).default("1"),
  limit: z
    .string()
    .transform(Number)
    .pipe(z.number().int().min(1).max(100))
    .default("10"),
  role: z.enum(["buyer", "admin"]).optional(),
  status: z.enum(["pending_verification", "active", "suspended"]).optional(),
  search: z.string().optional(),
});

export const updateUserStatusSchema = z.object({
  status: z.enum(["pending_verification", "active", "suspended"]),
});

export const promoteUserToAdminSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
});



export const getAnalyticsQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});


// Type Interfaces
export interface UserListItem {
  id: string;
  email: string;
  username: string;
  role: string;
  status: string;
  emailVerifiedAt: Date | null;
  createdAt: Date | null;
  profile?: {
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
  };
}

export interface UserListResponse {
  users: UserListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PlatformAnalytics {
  totalUsers: number;
  totalBuyers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
  }>;
  topProducts: Array<{
    productId: string;
    productName: string;
    totalSold: number;
  }>;
}

export interface SellerBalance {
  id: string;
  sellerId: string;
  orderId: string;
  paymentId: string;
  amount: number | string;
  status: string;
  paidOutAt: Date | null;
  notes: string | null;
  createdAt: Date | null;
  seller?: {
    id: string;
    username: string;
    email: string;
  };
  order?: {
    id: string;
    totalAmount: number | string;
    status: string;
  };
}

export interface SellerBalancesResponse {
  balances: SellerBalance[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    totalPending: number;
    totalPaidOut: number;
  };
}

// Type exports
export type GetUsersQuery = z.infer<typeof getUsersQuerySchema>;
export type UpdateUserStatusRequest = z.infer<typeof updateUserStatusSchema>;
export type GetAnalyticsQuery = z.infer<typeof getAnalyticsQuerySchema>;
