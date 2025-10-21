import { eq, sql } from "drizzle-orm";
import { db } from "../database/connection";
import { orders, orderItems, orderStatusHistory } from "../database/schemas/order";
import { products } from "../database/schemas/product";
import { CartService } from "./cart.service";
import { PaymentService } from "./payment.service";
import { CreatePaymentIntentRequest, PaymentIntent } from "../types/payment";
import { Order } from "../types/order";

const cartService = new CartService();
const paymentService = new PaymentService();

export class CheckoutService {
  async createCheckoutSession(
    userId: string,
    data: CreatePaymentIntentRequest
  ): Promise<PaymentIntent> {
    const cartItemsList = await cartService.getCartItems(userId);

    if (cartItemsList.length === 0) {
      throw new Error("Cart is empty");
    }

    const productDetails = await Promise.all(
      cartItemsList.map(async (item) => {
        const [product] = await db
          .select()
          .from(products)
          .where(eq(products.id, item.productId))
          .limit(1);

        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        if (product.status !== "active") {
          throw new Error(`Product "${product.name}" is not available`);
        }

        if (product.stockQuantity < item.quantity) {
          throw new Error(
            `Insufficient stock for "${product.name}". Only ${product.stockQuantity} items available`
          );
        }

        return { ...item, product };
      })
    );

    const totalAmount = productDetails.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );

    const paymentIntent = await paymentService.createPaymentIntent(
      userId,
      totalAmount,
      data.savePaymentMethod
    );

    return paymentIntent;
  }

  async processSuccessfulPayment(
    paymentIntentId: string,
    shippingAddress: string
  ): Promise<Order[]> {
    const payment = await paymentService.getPaymentByIntentId(paymentIntentId);

    if (!payment) {
      throw new Error("Payment not found");
    }

    if (payment.status !== "succeeded") {
      throw new Error("Payment not successful");
    }

    const userId = payment.userId;
    const cartItemsList = await cartService.getCartItems(userId);

    if (cartItemsList.length === 0) {
      throw new Error("Cart is empty");
    }

    const productDetails = await Promise.all(
      cartItemsList.map(async (item) => {
        const [product] = await db
          .select()
          .from(products)
          .where(eq(products.id, item.productId))
          .limit(1);

        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        return { ...item, product };
      })
    );

    const groupedBySeller = productDetails.reduce((acc, item) => {
      const sellerId = item.product.sellerId;
      if (!acc[sellerId]) {
        acc[sellerId] = [];
      }
      acc[sellerId].push(item);
      return acc;
    }, {} as Record<string, typeof productDetails>);

    const createdOrders: Order[] = [];

    for (const [sellerId, items] of Object.entries(groupedBySeller)) {
      const totalAmount = items.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
      );

      const [order] = await db
        .insert(orders)
        .values({
          buyerId: userId,
          sellerId,
          totalAmount: totalAmount.toString(),
          shippingAddress,
          status: "confirmed",
        })
        .returning();

      await db.insert(orderItems).values(
        items.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        }))
      );

      await db.insert(orderStatusHistory).values({
        orderId: order.id,
        status: "confirmed",
        notes: "Order confirmed after successful payment",
      });

      for (const item of items) {
        await db
          .update(products)
          .set({
            stockQuantity: sql`${products.stockQuantity} - ${item.quantity}`,
            updatedAt: new Date(),
          })
          .where(eq(products.id, item.productId));
      }

      await paymentService.createSellerBalance(
        sellerId,
        order.id,
        payment.id,
        totalAmount
      );

      createdOrders.push(order as Order);
    }

    await cartService.clearCart(userId);

    return createdOrders;
  }
}