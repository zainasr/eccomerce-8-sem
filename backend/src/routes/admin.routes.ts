import { Router } from "express";
import {
  getUsers,
  updateUserStatus,
  deleteUser,
  getPlatformAnalytics,
  promoteUserToAdmin,
  getAllOrders,
  getOrderById,
} from "../controllers/admin.controller";
import {
  authenticateToken,
  requireRole,
} from "../middleware/authenticate.middleware";
import { validateRequest } from "../middleware/validation.middleware";
import {
  getUsersQuerySchema,
  updateUserStatusSchema,
  getAnalyticsQuerySchema,
  promoteUserToAdminSchema,
} from "../types/admin";
import { updateOrderStatusSchema } from "../types/order";

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireRole(["admin"]));

// User Management
router.get("/users", validateRequest(getUsersQuerySchema, "query"), getUsers);
router.patch(
  "/users/:userId/status",
  validateRequest(updateUserStatusSchema),
  updateUserStatus
);
router.post(
  "/users/promote",
  validateRequest(promoteUserToAdminSchema),
  promoteUserToAdmin
);
router.delete("/users/:userId", deleteUser);

// Order Management
router.get("/orders", getAllOrders);
router.get("/orders/:orderId", getOrderById);

// Analytics
router.get(
  "/analytics",
  validateRequest(getAnalyticsQuerySchema, "query"),
  getPlatformAnalytics
);

export default router;