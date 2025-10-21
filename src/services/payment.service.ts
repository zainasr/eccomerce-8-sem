import { eq, desc, and, count } from "drizzle-orm";
import { db } from "../database/connection";
import { payments, sellerBalances } from "../database/schemas/payment";
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

      console.log("paymentMethodDetails in payment service: ", paymentMethodDetails);

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

    console.log("detailsJson in payment service: ", detailsJson);

    await db
      .update(payments)
      .set({
        status: "succeeded",
        paymentMethod: paymentMethodDetails?.type as any,
        paymentMethodDetails: detailsJson,
        updatedAt: new Date(),
      })
      .where(eq(payments.stripePaymentIntentId, paymentIntentId));

    console.log("payment updated in payment service: ", paymentIntentId);
  }

  async handlePaymentFailure(paymentIntentId: string): Promise<void> {
    await db
      .update(payments)
      .set({
        status: "failed",
        updatedAt: new Date(),
      })
      .where(eq(payments.stripePaymentIntentId, paymentIntentId));
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

  async createSellerBalance(
    sellerId: string,
    orderId: string,
    paymentId: string,
    amount: number
  ): Promise<void> {
    await db.insert(sellerBalances).values({
      sellerId,
      orderId,
      paymentId,
      amount: amount.toString(),
      status: "pending",
    });
  }
}