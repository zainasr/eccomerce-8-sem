import { Router } from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller";
import { authenticateToken } from "../middleware/authenticate.middleware";
import { validateRequest } from "../middleware/validation.middleware";
import {
  addToCartSchema,
  updateCartItemSchema,
} from "../types/order";

const router = Router();

// All cart routes require authentication
router.use(authenticateToken);

// Add item to cart
router.post("/items", validateRequest(addToCartSchema), addToCart);

// Get user's cart
router.get("/", getCart);

// Update cart item quantity
router.patch(
  "/items/:productId",
  validateRequest(updateCartItemSchema),
  updateCartItem
);

// Remove item from cart
router.delete("/items/:productId", removeFromCart);

// Clear entire cart
router.delete("/", clearCart);

export default router;