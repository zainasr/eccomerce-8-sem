import { eq, and, or, desc, asc, sql, count } from "drizzle-orm";
import { db } from "../database/connection";
import {
  orders,
  orderItems,
  orderStatusHistory,
  cartItems,
} from "../database/schemas/order";
import { products } from "../database/schemas/product";
import { users } from "../database/schemas/auth";
import {
  CreateOrderRequest,
  UpdateOrderStatusRequest,
  GetOrdersQuery,
  Order,
  OrderListResponse,
  OrderStatus,
} from "../types/order";
import { CartService } from "./cart.service";
import { payments } from "../database/schemas/payment";
import { PaymentService } from "./payment.service";

const cartService = new CartService();
const paymentService = new PaymentService();

export class OrderService {
  async createOrders(
    buyerId: string,
    data: CreateOrderRequest
  ): Promise<Order[]> {
    const cartItemsList = await cartService.getCartItems(buyerId);

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
          buyerId,
          sellerId,
          totalAmount: totalAmount.toString(),
          shippingAddress: data.shippingAddress,
          notes: data.notes,
          status: "pending",
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
        status: "pending",
        notes: "Order created",
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

      createdOrders.push(order as Order);
    }

    await cartService.clearCart(buyerId);

    return createdOrders;
  }

  async getOrders(
    userId: string,
    userRole: string,
    query: GetOrdersQuery
  ): Promise<OrderListResponse> {
    const { page, limit, status, sortBy, sortOrder } = query;
    const offset = (page - 1) * limit;

    let whereCondition;
    if (userRole === "admin") {
      whereCondition = status ? eq(orders.status, status) : undefined;
    } else if (userRole === "seller") {
      whereCondition = status
        ? and(eq(orders.sellerId, userId), eq(orders.status, status))
        : eq(orders.sellerId, userId);
    } else {
      whereCondition = status
        ? and(eq(orders.buyerId, userId), eq(orders.status, status))
        : eq(orders.buyerId, userId);
    }

    const orderBy =
      sortOrder === "asc" ? asc(orders[sortBy]) : desc(orders[sortBy]);

    const ordersList = await db
      .select()
      .from(orders)
      .where(whereCondition)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db
      .select({ total: count() })
      .from(orders)
      .where(whereCondition);

    const enrichedOrders = await Promise.all(
      ordersList.map(async (order) => {
        const [buyer] = await db
          .select({
            id: users.id,
            username: users.username,
            email: users.email,
          })
          .from(users)
          .where(eq(users.id, order.buyerId))
          .limit(1);

        const [seller] = await db
          .select({
            id: users.id,
            username: users.username,
            email: users.email,
          })
          .from(users)
          .where(eq(users.id, order.sellerId))
          .limit(1);

        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));

        return {
          ...order,
          buyer,
          seller,
          items,
        };
      })
    );

    return {
      orders: enrichedOrders,
      pagination: {
        page,
        limit,
        total: Number(total),
        totalPages: Math.ceil(Number(total) / limit),
      },
    };
  }

  async getOrderById(
    orderId: string,
    userId: string,
    userRole: string
  ): Promise<Order> {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order) {
      throw new Error("Order not found");
    }

    if (
      userRole !== "admin" &&
      order.buyerId !== userId &&
      order.sellerId !== userId
    ) {
      throw new Error("Unauthorized to view this order");
    }

    const [buyer] = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
      })
      .from(users)
      .where(eq(users.id, order.buyerId))
      .limit(1);

    const [seller] = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
      })
      .from(users)
      .where(eq(users.id, order.sellerId))
      .limit(1);

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id));

    const statusHistory = await db
      .select()
      .from(orderStatusHistory)
      .where(eq(orderStatusHistory.orderId, order.id))
      .orderBy(desc(orderStatusHistory.createdAt));

    return {
      ...order,
      buyer,
      seller,
      items,
      statusHistory,
    };
  }

  async updateOrderStatus(
    orderId: string,
    userId: string,
    userRole: string,
    data: UpdateOrderStatusRequest
  ): Promise<Order> {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order) {
      throw new Error("Order not found");
    }

    if (userRole !== "admin" && order.sellerId !== userId) {
      throw new Error("Only seller or admin can update order status");
    }

    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["processing", "cancelled"],
      processing: ["shipped", "cancelled"],
      shipped: ["delivered"],
      delivered: ["refunded"],
      cancelled: [],
      refunded: [],
    };

    const currentStatus = order.status as OrderStatus;
    const allowedStatuses = validTransitions[currentStatus];

    if (!allowedStatuses.includes(data.status as OrderStatus)) {
      throw new Error(
        `Cannot transition from ${currentStatus} to ${data.status}`
      );
    }

    await db
      .update(orders)
      .set({
        status: data.status,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId));

    await db.insert(orderStatusHistory).values({
      orderId: order.id,
      status: data.status,
      notes: data.notes || `Status updated to ${data.status}`,
    });

    return this.getOrderById(orderId, userId, userRole);
  }

  async cancelOrder(
    orderId: string,
    userId: string,
    userRole: string
  ): Promise<Order> {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order) {
      throw new Error("Order not found");
    }

    if (userRole !== "admin" && order.buyerId !== userId) {
      throw new Error("Only buyer or admin can cancel order");
    }

    if (!["pending", "confirmed"].includes(order.status)) {
      throw new Error("Order cannot be cancelled at this stage");
    }

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));

    for (const item of items) {
      await db
        .update(products)
        .set({
          stockQuantity: sql`${products.stockQuantity} + ${item.quantity}`,
          updatedAt: new Date(),
        })
        .where(eq(products.id, item.productId));
    }

    const [payment] = await db
  .select()
  .from(payments)
  .where(
    and(
      eq(payments.userId, order.buyerId),
      eq(payments.status, "succeeded")
    )
  )
  .orderBy(desc(payments.createdAt))
  .limit(1);

if (payment) {
  await paymentService.refundPayment(payment.stripePaymentIntentId, "Order cancelled by buyer");
}


    await db
      .update(orders)
      .set({
        status: "cancelled",
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId));

    await db.insert(orderStatusHistory).values({
      orderId: order.id,
      status: "cancelled",
      notes: "Order cancelled by buyer",
    });

    return this.getOrderById(orderId, userId, userRole);
  }
}