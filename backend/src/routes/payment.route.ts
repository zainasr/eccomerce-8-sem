import { Router } from "express";
import { getPaymentHistory, refundPayment } from "../controllers/payment.controller";
import { authenticateToken, requireRole } from "../middleware/authenticate.middleware";
import { validateRequest } from "../middleware/validation.middleware";
import { getPaymentHistoryQuerySchema } from "../types/payment";

const router = Router();


// Get payment history
router.get(
  "/history",
  authenticateToken,
  validateRequest(getPaymentHistoryQuerySchema, "query"),
  getPaymentHistory
);

// Refund  (Admin only)
router.post(
  "/refund",
  authenticateToken,
  requireRole(["admin"]),
  refundPayment
);

export default router;