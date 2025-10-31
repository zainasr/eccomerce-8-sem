import { eq, desc, and, count } from "drizzle-orm";
import { db } from "../database/connection";
import { payments } from "../database/schemas/payment";
import { users } from "../database/schemas/auth";
import {
  Payment,
  PaymentIntent,
  GetPaymentHistoryQuery,
  PaymentHistoryResponse,
} from "../types/payment";
import { stripe } from "../config/stripe";


export class PaymentService {
  async createPaymentIntent(
    userId: string,
    amount: number,
    savePaymentMethod: boolean = false
  ): Promise<PaymentIntent> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new Error("User not found");
    }

    let customerId = user.stripeCustomerId as any;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
          username: user.username,
        },
      });
      customerId = customer.id;

      await db
        .update(users)
        .set({ stripeCustomerId: customerId })
        .where(eq(users.id, userId));
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      customer: customerId,
      setup_future_usage: savePaymentMethod ? "off_session" : undefined,
      metadata: {
        userId,
      },
    });

    await db.insert(payments).values({
      userId,
      stripePaymentIntentId: paymentIntent.id,
      stripeCustomerId: customerId,
      amount: amount.toString(),
      currency: "usd",
      status: "pending",
    });

    return {
      clientSecret: paymentIntent.client_secret!,
      paymentIntentId: paymentIntent.id,
      amount,
      currency: "usd",
    };
  }

  async handlePaymentSuccess(paymentIntentId: string): Promise<void> {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    const paymentMethodDetails = paymentIntent.payment_method
      ? await stripe.paymentMethods.retrieve(
          paymentIntent.payment_method as string
        )
      : null;


    const detailsJson = paymentMethodDetails
      ? JSON.stringify({
          type: paymentMethodDetails.type,
          card: paymentMethodDetails.card
            ? {
                brand: paymentMethodDetails.card.brand,
                last4: paymentMethodDetails.card.last4,
                exp_month: paymentMethodDetails.card.exp_month,
                exp_year: paymentMethodDetails.card.exp_year,
              }
            : null,
        })
      : null;

      console.log("details json ",detailsJson)

    // Try to find existing payment
    const [existing] = await db
      .select()
      .from(payments)
      .where(eq(payments.stripePaymentIntentId, paymentIntentId))
      .limit(1);

    if (existing) {
      await db
        .update(payments)
        .set({
          status: "succeeded",
          paymentMethod: (paymentMethodDetails?.type as any) ?? null,
          paymentMethodDetails: detailsJson,
          updatedAt: new Date(),
        })
        .where(eq(payments.stripePaymentIntentId, paymentIntentId));
      return;
    }

    // Create if not exists (upsert behavior)
    let userId: string | null = (paymentIntent.metadata as any)?.userId || null;
    let stripeCustomerId: string | null = (paymentIntent.customer as string) || null;
    console.log("userId",userId)
    console.log("stripeCustomerId",stripeCustomerId)


    if (!userId && stripeCustomerId) {
      const [owner] = await db
        .select()
        .from(users)
        .where(eq(users.stripeCustomerId, stripeCustomerId))
        .limit(1);
      userId = owner?.id ?? null;

    }
    console.log("userId retrieved",userId)

    if (!userId) {
      // As a last resort, do nothing but log; we need userId for FK
      console.warn("handlePaymentSuccess: missing userId for paymentIntent", paymentIntentId);
      return;
    }

    const amountDecimal = (paymentIntent.amount_received ?? paymentIntent.amount ?? 0) / 100;

   const resp = await db.insert(payments).values({
      userId,
      stripePaymentIntentId: paymentIntent.id,
      stripeCustomerId: stripeCustomerId ?? undefined,
      amount: amountDecimal.toFixed(2),
      currency: (paymentIntent.currency || "usd") as string,
      status: "succeeded",
      paymentMethod: (paymentMethodDetails?.type as any) ?? null,
      paymentMethodDetails: detailsJson,
      metadata: paymentIntent.metadata ? JSON.stringify(paymentIntent.metadata) : null,
    });
    console.log("resp inserted",resp)
    console.log("payment inteded successfully")
  }

  async handlePaymentFailure(paymentIntentId: string): Promise<void> {
    // If exists, mark failed; else create a failed record so history is complete
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    const [existing] = await db
      .select()
      .from(payments)
      .where(eq(payments.stripePaymentIntentId, paymentIntentId))
      .limit(1);

    if (existing) {
      await db
        .update(payments)
        .set({
          status: "failed",
          updatedAt: new Date(),
        })
        .where(eq(payments.stripePaymentIntentId, paymentIntentId));
      return;
    }

    let userId: string | null = (paymentIntent.metadata as any)?.userId || null;
    const stripeCustomerId: string | null = (paymentIntent.customer as string) || null;

    if (!userId && stripeCustomerId) {
      const [owner] = await db
        .select()
        .from(users)
        .where(eq(users.stripeCustomerId, stripeCustomerId))
        .limit(1);
      userId = owner?.id ?? null;
    }

    if (!userId) {
      console.warn("handlePaymentFailure: missing userId for paymentIntent", paymentIntentId);
      return;
    }

    const amountDecimal = (paymentIntent.amount ?? 0) / 100;

    await db.insert(payments).values({
      userId,
      stripePaymentIntentId: paymentIntent.id,
      stripeCustomerId: stripeCustomerId ?? undefined,
      amount: amountDecimal.toFixed(2),
      currency: (paymentIntent.currency || "usd") as string,
      status: "failed",
      metadata: paymentIntent.metadata ? JSON.stringify(paymentIntent.metadata) : null,
    });
  }

  async getPaymentByIntentId(paymentIntentId: string): Promise<Payment | null> {
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.stripePaymentIntentId, paymentIntentId))
      .limit(1);

    return payment || null;
  }

  async getPaymentHistory(
    userId: string,
    query: GetPaymentHistoryQuery
  ): Promise<PaymentHistoryResponse> {
    const { page, limit, status, sortOrder } = query;
    const offset = (page - 1) * limit;

    const whereCondition = status
      ? and(eq(payments.userId, userId), eq(payments.status, status))
      : eq(payments.userId, userId);

    const orderBy =
      sortOrder === "asc"
        ? payments.createdAt
        : desc(payments.createdAt);

    const paymentsList = await db
      .select()
      .from(payments)
      .where(whereCondition)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db
      .select({ total: count() })
      .from(payments)
      .where(whereCondition);

    return {
      payments: paymentsList,
      pagination: {
        page,
        limit,
        total: Number(total),
        totalPages: Math.ceil(Number(total) / limit),
      },
    };
  }

  async refundPayment(paymentIntentId: string, reason?: string): Promise<void> {
    const payment = await this.getPaymentByIntentId(paymentIntentId);

    if (!payment) {
      throw new Error("Payment not found");
    }

    if (payment.status !== "succeeded") {
      throw new Error("Only succeeded payments can be refunded");
    }

    await stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason: "requested_by_customer",
      metadata: {
        refund_reason: reason || "Order cancelled",
      },
    });

    await db
      .update(payments)
      .set({
        status: "refunded",
        updatedAt: new Date(),
      })
      .where(eq(payments.id, payment.id));
  }

  async ensureSyncedFromStripe(paymentIntentId: string): Promise<Payment | null> {
    let payment = await this.getPaymentByIntentId(paymentIntentId);
    if (payment) return payment;

    // Fetch from Stripe, upsert (copy logic from handlePaymentSuccess but allow missing status)
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    let userId: string | null = (paymentIntent.metadata as any)?.userId || null;
    let stripeCustomerId: string | null = (paymentIntent.customer as string) || null;
    if (!userId && stripeCustomerId) {
      const [owner] = await db
        .select()
        .from(users)
        .where(eq(users.stripeCustomerId, stripeCustomerId))
        .limit(1);
      userId = owner?.id ?? null;
    }
    if (!userId) return null;
    const amountDecimal = (paymentIntent.amount_received ?? paymentIntent.amount ?? 0) / 100;
    const status = paymentIntent.status === "succeeded" ? "succeeded" : (paymentIntent.status === "processing" ? "processing" : "pending");
    const [inserted] = await db.insert(payments).values({
      userId,
      stripePaymentIntentId: paymentIntent.id,
      stripeCustomerId: stripeCustomerId ?? undefined,
      amount: amountDecimal.toFixed(2),
      currency: (paymentIntent.currency || 'usd') as string,
      status,
      metadata: paymentIntent.metadata ? JSON.stringify(paymentIntent.metadata) : null,
    }).returning();
    return inserted ?? null;
  }
}