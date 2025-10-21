import { z } from "zod";

// Enums
export const paymentStatuses = [
  "pending",
  "processing",
  "succeeded",
  "failed",
  "cancelled",
  "refunded",
] as const;

export const paymentMethods = ["card", "bank_transfer", "wallet"] as const;

export type PaymentStatus = (typeof paymentStatuses)[number];
export type PaymentMethod = (typeof paymentMethods)[number];

// Validation Schemas
export const createPaymentIntentSchema = z.object({
  savePaymentMethod: z.boolean().optional().default(false),
});

export const refundPaymentSchema = z.object({
  orderId: z.string().uuid("Invalid order ID"),
  reason: z.string().min(10, "Reason must be at least 10 characters").optional(),
});

export const getPaymentHistoryQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().int().min(1)).default("1"),
  limit: z
    .string()
    .transform(Number)
    .pipe(z.number().int().min(1).max(100))
    .default("10"),
  status: z.enum(paymentStatuses).optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const getSellerBalancesQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().int().min(1)).default("1"),
  limit: z
    .string()
    .transform(Number)
    .pipe(z.number().int().min(1).max(100))
    .default("10"),
  status: z.enum(["pending", "paid_out"]).optional(),
  sellerId: z.string().uuid().optional(),
});

export const markBalancePaidSchema = z.object({
  balanceId: z.string().uuid("Invalid balance ID"),
  notes: z.string().min(5, "Notes must be at least 5 characters").optional(),
});

// Type Interfaces
export interface Payment {
  id: string;
  userId: string;
  stripePaymentIntentId: string;
  stripeCustomerId: string | null;
  amount: number | string;
  currency: string;
  status: PaymentStatus | string;
  paymentMethod: PaymentMethod | string | null;
  paymentMethodDetails: string | null;
  metadata: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

export interface PaymentMethodInfo {
  id: string;
  userId: string;
  stripeCustomerId: string;
  stripePaymentMethodId: string;
  type: PaymentMethod | string;
  cardBrand: string | null;
  cardLast4: string | null;
  cardExpMonth: string | null;
  cardExpYear: string | null;
  isDefault: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
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
  updatedAt: Date | null;
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

export interface PaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

export interface PaymentHistoryResponse {
  payments: Payment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
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

export interface StripeWebhookEvent {
  type: string;
  data: {
    object: any;
  };
}

// Type exports for request validation
export type CreatePaymentIntentRequest = z.infer<typeof createPaymentIntentSchema>;
export type RefundPaymentRequest = z.infer<typeof refundPaymentSchema>;
export type GetPaymentHistoryQuery = z.infer<typeof getPaymentHistoryQuerySchema>;
export type GetSellerBalancesQuery = z.infer<typeof getSellerBalancesQuerySchema>;
export type MarkBalancePaidRequest = z.infer<typeof markBalancePaidSchema>;