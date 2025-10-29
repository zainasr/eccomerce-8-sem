import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { getProductsQuerySchema } from "../types/product";

const productService = new ProductService();

export const createProduct = async (req: Request, res: Response) => {
  try {
    const sellerId = (req as any).user?.userId as string;
    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }
    const product = await productService.createProduct(req.body, sellerId);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create product",
    });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const query = req.query as unknown as ReturnType<
      typeof getProductsQuerySchema.parse
    >;
    const result = await productService.getProducts(query);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to get products",
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await productService.incrementViewCount(id);

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to get product",
    });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params as any;
    const product = await productService.getProductBySlug(slug);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // increment view count by id
    await productService.incrementViewCount(product.id);

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to get product",
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sellerId = (req as any).user?.userId as string;

    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }
    const product = await productService.updateProduct(id, req.body, sellerId);

    res.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update product",
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sellerId = (req as any).user?.userId as string;

    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    await productService.deleteProduct(id, sellerId);

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete product",
    });
  }



};

