import { Router } from "express";
import { createPaymentIntent } from "../controllers/checkout.controller";
import { authenticateToken, requireRole } from "../middleware/authenticate.middleware";
import { validateRequest } from "../middleware/validation.middleware";
import { createPaymentIntentSchema } from "../types/payment";

const router = Router();

// Create payment intent for checkout (Buyer only)
router.post(
  "/create-payment-intent",
  authenticateToken,
  requireRole(["buyer"]),
  validateRequest(createPaymentIntentSchema),
  createPaymentIntent
);

export default router;