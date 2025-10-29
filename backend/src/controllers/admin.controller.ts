import { Request, Response } from "express";
import { AdminService } from "../services/admin.service";

const adminService = new AdminService();

export const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await adminService.getUsers(req.query as any);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to get users",
    });
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    await adminService.updateUserStatus(userId, req.body);

    res.json({
      success: true,
      message: "User status updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update user status",
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    await adminService.deleteUser(userId);

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete user",
    });
  }
};

export const getPlatformAnalytics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const analytics = await adminService.getPlatformAnalytics(
      startDate as string,
      endDate as string
    );

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to get analytics",
    });
  }
};

export const promoteUserToAdmin = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    await adminService.promoteUserToAdmin(userId);

    res.json({
      success: true,
      message: "User promoted to admin successfully. User must log in again.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to promote user",
    });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const result = await adminService.getAllOrders(req.query);

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
    const { orderId } = req.params;
    const order = await adminService.getOrderById(orderId);

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : "Order not found",
    });
  }
};