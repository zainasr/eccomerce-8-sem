import { Request, Response } from "express";
import { OrderService } from "../services/order.service";

const orderService = new OrderService();

export const createOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const orders = await orderService.createOrders(userId, req.body);

    res.status(201).json({
      success: true,
      message: `${orders.length} order(s) created successfully`,
      data: { orders },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to create order",
    });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const userRole = (req as any).user?.role;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const result = await orderService.getOrders(
      userId,
      userRole,
      req.query as any
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to get orders",
    });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const userRole = (req as any).user?.role;
    const { orderId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const order = await orderService.getOrderById(orderId, userId, userRole);

    res.json({
      success: true,
      data: { order },
    });
  } catch (error) {
    const statusCode = error instanceof Error && error.message.includes("Unauthorized") ? 403 : 404;
    
    res.status(statusCode).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to get order",
    });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const userRole = (req as any).user?.role;
    const { orderId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const order = await orderService.updateOrderStatus(
      orderId,
      userId,
      userRole,
      req.body
    );

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: { order },
    });
  } catch (error) {
    const statusCode = error instanceof Error && error.message.includes("Unauthorized") ? 403 : 400;
    
    res.status(statusCode).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update order status",
    });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const userRole = (req as any).user?.role;
    const { orderId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const order = await orderService.cancelOrder(orderId, userId, userRole);

    res.json({
      success: true,
      message: "Order cancelled successfully",
      data: { order },
    });
  } catch (error) {
    const statusCode = error instanceof Error && error.message.includes("Unauthorized") ? 403 : 400;
    
    res.status(statusCode).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to cancel order",
    });
  }
};