import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/category.controller";
import { validateRequest } from "../middleware/validation.middleware";
import {
  createCategorySchema,
  getCategoriesQuerySchema,
  updateCategorySchema,
} from "../types/product";
import { authenticateToken, requireRole } from "../middleware/authenticate.middleware";
const router = Router();
router.get(
  "/get-all-categories",
  validateRequest(getCategoriesQuerySchema, "query"),
  getCategories
);
router.get("/:id", getCategoryById);

router.post(
  "/create-category",
  authenticateToken,
  requireRole(["admin"]),
  validateRequest(createCategorySchema),
  createCategory
);
router.put("/:id", authenticateToken, requireRole(["admin"]), validateRequest(updateCategorySchema), updateCategory);
router.delete("/:id", authenticateToken, requireRole(["admin"]), deleteCategory);


export default router;
