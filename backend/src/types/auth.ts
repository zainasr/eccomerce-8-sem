import { z } from "zod";

// B2C Model: Only "buyer" and "admin" roles
export const userRoles = ["buyer", "admin"] as const;
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
  // B2C: role field removed - all registrations are "buyer" by default
});

export const loginSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

// B2C: switchRoleSchema removed - no role switching in B2C model

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
  tokenVersion: number;
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

}

export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;
