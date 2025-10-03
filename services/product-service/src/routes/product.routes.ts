import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { authenticateToken, requireRole } from "shared";
import { validateRequest } from "shared";
import {
  createProductSchema,
  updateProductSchema,
  getProductsQuerySchema,
} from "shared";

const router = Router();

// Public routes
router.get(
  "/get-all-products",
  validateRequest(getProductsQuerySchema),
  getProducts
);
router.get("/:id", getProductById);

// Protected routes (seller only)
router.post(
  "/create-product",
  authenticateToken,
  validateRequest(createProductSchema),
  createProduct
);
router.put(
  "/:id",
  authenticateToken,
  requireRole(["seller"]),
  validateRequest(updateProductSchema),
  updateProduct
);
router.delete(
  "/:id",
  authenticateToken,
  requireRole(["seller"]),
  deleteProduct
);

export default router;
