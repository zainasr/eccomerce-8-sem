import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";
import { getCategoriesQuerySchema } from "shared";

const categoryService = new CategoryService();

export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.createCategory(req.body);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create category",
    });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const query = getCategoriesQuerySchema.parse(req.query);
    const result = await categoryService.getCategories(query);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to get categories",
    });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to get category",
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await categoryService.updateCategory(id, req.body);

    res.json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update category",
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await categoryService.deleteCategory(id);

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete category",
    });
  }
};
