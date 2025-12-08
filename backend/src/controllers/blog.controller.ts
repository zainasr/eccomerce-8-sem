import { Request, Response } from "express";
import { BlogService } from "../services/blog.service";

const blogService = new BlogService();

export const createBlog = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const blog = await blogService.createBlog(req.body, user.userId);
    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to create blog",
    });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await blogService.updateBlog(id, req.body);
    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to update blog",
    });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await blogService.deleteBlog(id);
    res.json({ success: true, message: "Blog deleted" });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete blog",
    });
  }
};

export const getBlogById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await blogService.getBlogById(id);
    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : "Blog not found",
    });
  }
};

export const listBlogs = async (req: Request, res: Response) => {
  try {
    const result = await blogService.listBlogs(req.query as any);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch blogs",
    });
  }
};

export const listPublishedBlogs = async (req: Request, res: Response) => {
  try {
    const result = await blogService.listPublishedBlogs(req.query as any);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch blogs",
    });
  }
};

export const getPublishedBlogBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const blog = await blogService.getPublishedBlogBySlug(slug);
    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : "Blog not found",
    });
  }
};

