import { Router } from "express";
import {
  forgotPassword,
  getProfile,
  login,
  logout,
  register,
  resendVerificationEmail,
  resetPassword,
  verifyEmail,
} from "../controllers/auth.controller";

import { authenticateToken, requireRole } from "../middleware/authenticate.middleware";
import { validateRequest } from "../middleware/validation.middleware";
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from "../types/auth";

const router = Router();

// B2C Auth Routes - Simplified (no role switching)
router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/forgot-password", validateRequest(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validateRequest(resetPasswordSchema), resetPassword);
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);
router.post("/logout", authenticateToken, logout);
router.get("/profile", authenticateToken, getProfile);

// Admin test route
router.get("/admin", authenticateToken, requireRole(['admin']), (req: any, res: any) => {
  res.json({ message: 'Admin access granted' });
});

export default router;



