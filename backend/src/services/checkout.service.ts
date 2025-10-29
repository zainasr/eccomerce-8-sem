import { eq, sql } from "drizzle-orm";
import { db } from "../database/connection";
import { orders, orderItems, orderStatusHistory } from "../database/schemas/order";
import { products } from "../database/schemas/product";
import { CartService } from "./cart.service";
import { PaymentService } from "./payment.service";
import { Order } from "../types/order";
import { stripe } from "../config/stripe";

const cartService = new CartService();
const paymentService = new PaymentService();

export class CheckoutService {
  async createCheckoutSession(userId: string, savePaymentMethod: boolean = false): Promise<{ sessionUrl: string }> {
    const cartItemsList = await cartService.getCartItems(userId);

    if (cartItemsList.length === 0) {
      throw new Error("Cart is empty");
    }

    // Validate products and create line items
    const lineItems = await Promise.all(
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

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: product.description || undefined,
            },
            unit_amount: Math.round(Number(item.price) * 100), // Convert to cents
          },
          quantity: item.quantity,
        };
      })
    );

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard/cart`,
      metadata: {
        userId,
      },
    });

    return {
      sessionUrl: session.url!,
    };
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

    // B2C Model: No need to group by seller - all products belong to platform
    // Create a single order for all items
    const totalAmount = productDetails.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );

    // Get the platform seller ID (first product's sellerId, all should be same)
    const platformSellerId = productDetails[0].product.sellerId;

    const [order] = await db
      .insert(orders)
      .values({
        buyerId: userId,
        sellerId: platformSellerId, // B2C: Always platform admin
        totalAmount: totalAmount.toString(),
        shippingAddress,
        status: "confirmed",
      })
      .returning();

    // Insert all order items
    await db.insert(orderItems).values(
      productDetails.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      }))
    );

    // Create order status history
    await db.insert(orderStatusHistory).values({
      orderId: order.id,
      status: "confirmed",
      notes: "Order confirmed after successful payment",
    });

    // Update stock quantities for all products
    for (const item of productDetails) {
      await db
        .update(products)
        .set({
          stockQuantity: sql`${products.stockQuantity} - ${item.quantity}`,
          updatedAt: new Date(),
        })
        .where(eq(products.id, item.productId));
    }

    // B2C: No seller balance tracking needed - payment goes directly to platform
    const createdOrders: Order[] = [order as Order];

    await cartService.clearCart(userId);

    return createdOrders;
  }
}