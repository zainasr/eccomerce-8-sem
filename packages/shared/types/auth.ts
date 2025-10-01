import { z } from "zod";

export const userRoles = ["buyer", "seller", "admin"] as const;
export const userStatuses = [
  "pending_verification",
  "active",
  "suspended",
] as const;

export type UserRole = (typeof userRoles)[number];
export type UserStatus = (typeof userStatuses)[number];

export const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
});

export const loginSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

export const switchRoleSchema = z.object({
  role: z.enum(["buyer", "seller"]),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
  role: UserRole;
  status: UserStatus;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
    role: UserRole;
    status: UserStatus;
    profile?: {
      firstName?: string;
      lastName?: string;
      profilePicture?: string;
    };
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type SwitchRoleRequest = z.infer<typeof switchRoleSchema>;
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;
