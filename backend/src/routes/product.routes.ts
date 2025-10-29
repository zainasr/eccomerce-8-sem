import { Router } from "express";
import z from "zod";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProductBySlug,
  getProducts,
  updateProduct,
} from "../controllers/product.controller";
import { authenticateToken, requireRole } from "../middleware/authenticate.middleware";
import { validateRequest } from "../middleware/validation.middleware";
import {
  createProductSchema,
  getProductsQuerySchema,
  updateProductSchema,
} from "../types/product";

const router = Router();

router.get(
  "/get-all-products",
  validateRequest(getProductsQuerySchema, "query"),
  getProducts
);
router.get("/get-product-by-id/:id", getProductById);
router.get("/get-product-by-slug/:slug", getProductBySlug);
router.post(
  "/create-product",
  authenticateToken,
  requireRole(["admin"]),
  validateRequest(createProductSchema),
  createProduct
);
router.put(
  "/:id",
  authenticateToken,
  requireRole(["admin"]),
  validateRequest(updateProductSchema),
  updateProduct
);
router.delete(
  "/:id",
  authenticateToken,
  requireRole(["admin"]),
  deleteProduct
);

export default router;
