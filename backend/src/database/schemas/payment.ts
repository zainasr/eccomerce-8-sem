import {
  pgTable,
  uuid,
  varchar,
  text,
  decimal,
  timestamp,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./auth";
  
  // Payment Status Enum
  export const paymentStatusEnum = pgEnum("payment_status", [
    "pending",
    "processing",
    "succeeded",
    "failed",
    "cancelled",
    "refunded",
  ]);
  
  // Payment Method Type Enum
  export const paymentMethodEnum = pgEnum("payment_method", [
    "card",
    "bank_transfer",
    "wallet",
    "link",
    "fpx",
    "grabpay",
    "gcash",
    "paymaya",
    "paypal",
    "paytm",
    "phone_number",
    "promptpay",
  ]);
  
  // Payments Table
  export const payments = pgTable("payments", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 })
      .notNull()
      .unique(),
    stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull().default("usd"),
    status: paymentStatusEnum("status").notNull().default("pending"),
    paymentMethod: paymentMethodEnum("payment_method"),
    paymentMethodDetails: text("payment_method_details"), // JSON string with card last4, brand, etc.
    metadata: text("metadata"), // JSON string for additional data
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  });
  
  // Payment Methods Table (Saved cards)
  export const paymentMethods = pgTable("payment_methods", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    stripeCustomerId: varchar("stripe_customer_id", { length: 255 }).notNull(),
    stripePaymentMethodId: varchar("stripe_payment_method_id", { length: 255 })
      .notNull()
      .unique(),
    type: paymentMethodEnum("type").notNull(),
    cardBrand: varchar("card_brand", { length: 50 }), // visa, mastercard, etc.
    cardLast4: varchar("card_last4", { length: 4 }),
    cardExpMonth: varchar("card_exp_month", { length: 2 }),
    cardExpYear: varchar("card_exp_year", { length: 4 }),
    isDefault: boolean("is_default").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  });
  
  // B2C Model: No seller balances needed
  // Platform (you) receives all payments directly
  // Removed seller_balances table - not needed for B2C
  
  // Relations - Simplified for B2C
  export const paymentsRelations = relations(payments, ({ one }) => ({
    user: one(users, {
      fields: [payments.userId],
      references: [users.id],
    }),
  }));
  
  export const paymentMethodsRelations = relations(paymentMethods, ({ one }) => ({
    user: one(users, {
      fields: [paymentMethods.userId],
      references: [users.id],
    }),
  }));