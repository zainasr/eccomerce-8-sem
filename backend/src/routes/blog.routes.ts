import { Router } from "express";
import {
  getPublishedBlogBySlug,
  listPublishedBlogs,
} from "../controllers/blog.controller";
import { validateRequest } from "../middleware/validation.middleware";
import { listBlogsQuerySchema } from "../types/blog";

const router = Router();

router.get("/", validateRequest(listBlogsQuerySchema, "query"), listPublishedBlogs);
router.get("/:slug", getPublishedBlogBySlug);

export default router;

