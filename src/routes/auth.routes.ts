import { Router } from "express";
import {
  forgotPassword,
  getProfile,
  login,
  logout,
  register,
  resendVerificationEmail,
  resetPassword,
  switchRole,
  verifyEmail,
} from "../controllers/auth.controller";

import { authenticateToken, requireRole } from "../middleware/authenticate.middleware";
import { validateRequest } from "../middleware/validation.middleware";
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema, switchRoleSchema } from "../types/auth";

const router = Router();
router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/forgot-password", validateRequest(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validateRequest(resetPasswordSchema), resetPassword);
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);
router.post("/logout", authenticateToken, logout);
router.get("/profile", authenticateToken, getProfile);
router.post("/switch-role", authenticateToken, validateRequest(switchRoleSchema), switchRole);


router.get("/admin", authenticateToken, requireRole(['admin']), (req: any, res: any) => {
  res.json({ message: 'Admin access granted' });
});

export default router;



