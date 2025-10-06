import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  verifyEmail,
  switchRole,
  getProfile,
  forgotPassword,
  resetPassword,
  resendVerificationEmail,
} from "../controllers/auth.controller";

import { validateRequest, authenticateToken } from "shared";
import {
  registerSchema,
  loginSchema,
  switchRoleSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "shared";

const router = Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/refresh", refreshToken);
router.get("/verify-email/:token", verifyEmail);
router.post(
  "/forgot-password",
  validateRequest(forgotPasswordSchema),
  forgotPassword
);
router.post(
  "/reset-password",
  validateRequest(resetPasswordSchema),
  resetPassword
);
router.post(
  "/resend-verification",
  validateRequest(forgotPasswordSchema),
  resendVerificationEmail
);
router.post(
  "/switch-role",
  authenticateToken,
  validateRequest(switchRoleSchema),
  switchRole
);
router.get("/me", authenticateToken, getProfile);

export default router;
