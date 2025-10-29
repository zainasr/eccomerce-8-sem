import { Router } from "express";
import { createCheckoutSession } from "../controllers/checkout.controller";
import { authenticateToken, requireRole } from "../middleware/authenticate.middleware";
import { validateRequest } from "../middleware/validation.middleware";
import { createCheckoutSessionSchema } from "../types/payment";

const router = Router();

// Create payment intent for checkout (Buyer only)
router.post(
  "/create-checkout-session",
  authenticateToken,
  requireRole(["buyer"]),
  validateRequest(createCheckoutSessionSchema),
  createCheckoutSession
);


export default router;