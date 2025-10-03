import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";
import { validateRequest } from "shared";
import {
  createCategorySchema,
  updateCategorySchema,
  getCategoriesQuerySchema,
} from "shared";

const router = Router();

// Public routes
router.get("/", validateRequest(getCategoriesQuerySchema), getCategories);
router.get("/:id", getCategoryById);

// Admin routes (for now, no auth required - you can add later)
router.post(
  "/create-category",
  validateRequest(createCategorySchema),
  createCategory
);
router.put("/:id", validateRequest(updateCategorySchema), updateCategory);
router.delete("/:id", deleteCategory);

export default router;
