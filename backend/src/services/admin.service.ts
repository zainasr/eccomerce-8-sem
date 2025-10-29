import { eq, desc, count, sql, gte, lte, and } from "drizzle-orm";
import { db } from "../database/connection";
import { users, userProfiles } from "../database/schemas/auth";
import { orderItems, orders} from "../database/schemas/order";
import { products } from "../database/schemas/product";
import {
  GetUsersQuery,
  UserListResponse,
  UpdateUserStatusRequest,
  PlatformAnalytics,
} from "../types/admin";

export class AdminService {
  async getUsers(query: GetUsersQuery): Promise<UserListResponse> {
    const { page, limit, role, status, search } = query;
    const offset = (page - 1) * limit;

    const whereConditions: any[] = [];

    if (role) {
      whereConditions.push(eq(users.role, role));
    }

    if (status) {
      whereConditions.push(eq(users.status, status));
    }

    if (search) {
      whereConditions.push(
        sql`${users.email} ILIKE ${'%' + search + '%'} OR ${users.username} ILIKE ${'%' + search + '%'}`
      );
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const usersList = await db
      .select({
        user: users,
        profile: userProfiles,
      })
      .from(users)
      .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
      .where(whereClause)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db
      .select({ total: count() })
      .from(users)
      .where(whereClause);

    return {
      users: usersList.map((row) => ({
        id: row.user.id,
        email: row.user.email,
        username: row.user.username,
        role: row.user.role,
        status: row.user.status,
        emailVerifiedAt: row.user.emailVerifiedAt,
        createdAt: row.user.createdAt,
        profile: row.profile
          ? {
              firstName: row.profile.firstName || undefined,
              lastName: row.profile.lastName || undefined,
              profilePicture: row.profile.profilePicture || undefined,
            }
          : undefined,
      })),
      pagination: {
        page,
        limit,
        total: Number(total),
        totalPages: Math.ceil(Number(total) / limit),
      },
    };
  }

  async updateUserStatus(userId: string, data: UpdateUserStatusRequest): Promise<void> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new Error("User not found");
    }

    await db
      .update(users)
      .set({
        status: data.status,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  async deleteUser(userId: string): Promise<void> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new Error("User not found");
    }

    await db.delete(users).where(eq(users.id, userId));
  }

  async promoteUserToAdmin(userId: string): Promise<void> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.role === "admin") {
      throw new Error("User is already an admin");
    }

    await db
      .update(users)
      .set({
        role: "admin",
        tokenVersion: sql`${users.tokenVersion} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  async getPlatformAnalytics(startDate?: string, endDate?: string): Promise<PlatformAnalytics> {
    const whereConditions: any[] = [];

    if (startDate) {
      whereConditions.push(gte(orders.createdAt, new Date(startDate)));
    }

    if (endDate) {
      whereConditions.push(lte(orders.createdAt, new Date(endDate)));
    }

    const dateFilter = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const [totalUsersResult] = await db
      .select({ count: count() })
      .from(users);

    const [buyersResult] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, "buyer"));

    const [totalOrdersResult] = await db
      .select({ count: count() })
      .from(orders)
      .where(dateFilter);

    const [totalRevenueResult] = await db
      .select({ 
        total: sql<number>`COALESCE(SUM(CAST(${orders.totalAmount} AS NUMERIC)), 0)` 
      })
      .from(orders)
      .where(and(dateFilter, eq(orders.status, "delivered")));

    const revenueByMonth = await db
      .select({
        month: sql<string>`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`,
        revenue: sql<number>`COALESCE(SUM(CAST(${orders.totalAmount} AS NUMERIC)), 0)`,
      })
      .from(orders)
      .where(and(dateFilter, eq(orders.status, "delivered")))
      .groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`)
      .orderBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`);

    const topProducts = await db
      .select({
        productId: products.id,
        productName: products.name,
        totalSold: sql<number>`COALESCE(SUM(${sql`CAST(${orders.totalAmount} AS NUMERIC)`}), 0)`,
      })
      .from(orders)
      .innerJoin(sql`order_items`, sql`orders.id = order_items.order_id`)
      .innerJoin(products, sql`order_items.product_id = ${products.id}`)
      .where(and(dateFilter, eq(orders.status, "delivered")))
      .groupBy(products.id, products.name)
      .orderBy(desc(sql`COALESCE(SUM(${sql`CAST(${orders.totalAmount} AS NUMERIC)`}), 0)`))
      .limit(10);

    return {
      totalUsers: Number(totalUsersResult.count),
      totalBuyers: Number(buyersResult.count),
      totalOrders: Number(totalOrdersResult.count),
      totalRevenue: Number(totalRevenueResult.total),
      revenueByMonth: revenueByMonth.map((row) => ({
        month: row.month,
        revenue: Number(row.revenue),
      })),
      topProducts: topProducts.map((row) => ({
        productId: row.productId,
        productName: row.productName,
        totalSold: Number(row.totalSold),
      })),
    };
  }

  async getAllOrders(query: any) {
    const { page = 1, limit = 20, status, startDate, endDate } = query;
    const offset = (page - 1) * limit;

    const whereConditions: any[] = [];

    if (status) {
      whereConditions.push(eq(orders.status, status));
    }

    if (startDate) {
      whereConditions.push(gte(orders.createdAt, new Date(startDate)));
    }

    if (endDate) {
      whereConditions.push(lte(orders.createdAt, new Date(endDate)));
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const ordersList = await db
      .select({
        order: orders,
        buyer: users,
      })
      .from(orders)
      .leftJoin(users, eq(orders.buyerId, users.id))
      .where(whereClause)
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db
      .select({ total: count() })
      .from(orders)
      .where(whereClause);

    return {
      orders: ordersList.map((row) => ({
        id: row.order.id,
        buyerId: row.order.buyerId,
        sellerId: row.order.sellerId,
        status: row.order.status,
        totalAmount: row.order.totalAmount,
        shippingAddress: row.order.shippingAddress,
        notes: row.order.notes,
        createdAt: row.order.createdAt,
        updatedAt: row.order.updatedAt,
        buyer: row.buyer ? {
          id: row.buyer.id,
          username: row.buyer.username,
          email: row.buyer.email,
        } : null,
      })),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: Number(total),
        totalPages: Math.ceil(Number(total) / limit),
      },
    };
  }

  async getOrderById(orderId: string) {
    const [order] = await db
      .select({
        order: orders,
        buyer: users,
      })
      .from(orders)
      .leftJoin(users, eq(orders.buyerId, users.id))
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order) {
      throw new Error("Order not found");
    }

    const orderItemsList = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));

    return {
      ...order.order,
      buyer: order.buyer ? {
        id: order.buyer.id,
        username: order.buyer.username,
        email: order.buyer.email,
      } : null,
      items: orderItemsList,
    };
  }
}