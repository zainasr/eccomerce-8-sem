import { Router } from "express";
import {
  createBlog,
  deleteBlog,
  getBlogById,
  listBlogs,
  updateBlog,
} from "../controllers/blog.controller";
import {
  authenticateToken,
  requireRole,
} from "../middleware/authenticate.middleware";
import { validateRequest } from "../middleware/validation.middleware";
import {
  createBlogSchema,
  updateBlogSchema,
  listBlogsQuerySchema,
} from "../types/blog";

const router = Router();

router.use(authenticateToken);
router.use(requireRole(["admin"]));

router.get("/", validateRequest(listBlogsQuerySchema, "query"), listBlogs);
router.get("/:id", getBlogById);
router.post("/", validateRequest(createBlogSchema), createBlog);
router.patch("/:id", validateRequest(updateBlogSchema), updateBlog);
router.delete("/:id", deleteBlog);

export default router;

