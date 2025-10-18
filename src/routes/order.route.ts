import { Router } from "express";
import {
  createOrders,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/order.controller";
import {
  authenticateToken,
  requireRole,
} from "../middleware/authenticate.middleware";
import { validateRequest } from "../middleware/validation.middleware";
import {
  createOrderSchema,
  updateOrderStatusSchema,
  getOrdersQuerySchema,
} from "../types/order";

const router = Router();

// All order routes require authentication
router.use(authenticateToken);

// Create order(s) from cart - Buyer only
router.post(
  "/",
  requireRole(["buyer"]),
  validateRequest(createOrderSchema),
  createOrders
);

// Get orders (role-based filtering applied in service)
router.get("/", validateRequest(getOrdersQuerySchema, "query"), getOrders);

// Get order by ID
router.get("/:orderId", getOrderById);

// Update order status - Seller or Admin only
router.patch(
  "/:orderId/status",
  requireRole(["seller", "admin"]),
  validateRequest(updateOrderStatusSchema),
  updateOrderStatus
);

// Cancel order - Buyer or Admin only
router.delete("/:orderId", requireRole(["buyer", "admin"]), cancelOrder);

export default router;