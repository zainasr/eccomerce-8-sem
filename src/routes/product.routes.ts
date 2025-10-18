import { Router } from "express";
import z from "zod";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  getSellerProducts,
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

router.get(
  "/seller-products",
  authenticateToken,
  requireRole(["seller"]),
  validateRequest(getProductsQuerySchema, "query"),
  getSellerProducts
)
router.get("/:id", getProductById);



router.post(
  "/create-product",
  authenticateToken,
  requireRole(["seller", "admin"]),
  validateRequest(createProductSchema),
  createProduct
);
router.put(
  "/:id",
  authenticateToken,
  requireRole(["seller", "admin"]),
  validateRequest(updateProductSchema),
  updateProduct
);
router.delete(
  "/:id",
  authenticateToken,
  requireRole(["seller", "admin"]),
  deleteProduct
);

export default router;
