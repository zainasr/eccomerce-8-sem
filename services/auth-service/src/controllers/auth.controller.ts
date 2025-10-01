import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  try {
    const { user, verificationToken } = await authService.register(req.body);

    res.status(201).json({
      success: true,
      message:
        "Registration successful. Please check your email for verification.",
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        verificationToken,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Registration failed",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const authResponse = await authService.login(req.body);

    res.json({
      success: true,
      message: "Login successful",
      data: authResponse,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : "Login failed",
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    const tokens = await authService.refreshToken(token);

    res.json({
      success: true,
      message: "Token refreshed successfully",
      data: tokens,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : "Token refresh failed",
    });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    await authService.verifyEmail(token);

    res.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Email verification failed",
    });
  }
};

export const switchRole = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    await authService.switchRole(userId, req.body.role);

    res.json({
      success: true,
      message: `Role switched to ${req.body.role} successfully. Please log in again to get new tokens.`,
      requiresReauth: true, // Signal client to re-authenticate
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Role switch failed",
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get profile",
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    await authService.forgotPassword(req.body);

    res.json({
      success: true,
      message: "If your email exists, you will receive a password reset link",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Password reset failed",
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    await authService.resetPassword(req.body);

    res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Password reset failed",
    });
  }
};

export const resendVerificationEmail = async (req: Request, res: Response) => {
  try {
    await authService.resendVerificationEmail(req.body.email);

    res.json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to send verification email",
    });
  }
};
