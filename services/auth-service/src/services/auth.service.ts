import { eq, or } from "drizzle-orm";
import {
  db,
  users,
  userProfiles,
  refreshTokens,
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  UserRole,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "shared";
import { hashPassword, verifyPassword } from "../utils/password";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { generateUsername, generateUsernameFromEmail } from "../utils/username";
import {
  generateVerificationToken,
  generateResetToken,
  hashToken,
} from "../utils/tokens";
import { emailService } from "./email.service";

export class AuthService {
  async register(
    data: RegisterRequest
  ): Promise<{ user: any; verificationToken: string }> {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);
    if (existingUser.length > 0) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await hashPassword(data.password);
    const username =
      data.firstName && data.lastName
        ? generateUsername(data.firstName, data.lastName)
        : generateUsernameFromEmail(data.email);

    const verificationToken = generateVerificationToken();

    const [newUser] = await db
      .insert(users)
      .values({
        email: data.email,
        username,
        passwordHash: hashedPassword,
        emailVerificationToken: hashToken(verificationToken),
      })
      .returning();

    if (data.firstName || data.lastName) {
      await db.insert(userProfiles).values({
        userId: newUser.id,
        firstName: data.firstName,
        lastName: data.lastName,
        profilePicture: `https://api.dicebear.com/7.x/initials/svg?seed=${data.firstName}${data.lastName}`,
      });
    }

    // Send verification email
    try {
      await emailService.sendVerificationEmail(
        newUser.email,
        verificationToken,
        data.firstName
      );
      console.log("email verification send there");
    } catch (error) {
      console.error("Failed to send verification email:", error);
      // Don't throw error - user is created, just email failed
    }

    return { user: newUser, verificationToken };
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const [user] = await db
      .select()
      .from(users)
      .where(
        or(
          eq(users.email, data.identifier),
          eq(users.username, data.identifier)
        )
      )
      .limit(1);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await verifyPassword(
      data.password,
      user.passwordHash
    );
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    if (user.status === "pending_verification") {
      throw new Error("Please verify your email first");
    }

    if (user.status === "suspended") {
      throw new Error("Account is suspended");
    }

    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, user.id))
      .limit(1);

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      status: user.status,
    });

    const refreshToken = generateRefreshToken(user.id);
    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db.insert(refreshTokens).values({
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: refreshTokenExpiry,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        status: user.status,
        profile: profile
          ? {
              firstName: profile.firstName || undefined,
              lastName: profile.lastName || undefined,
              profilePicture: profile.profilePicture || undefined,
            }
          : undefined,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  async refreshToken(
    token: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { userId } = verifyRefreshToken(token);
    const tokenHash = hashToken(token);

    const [storedToken] = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.tokenHash, tokenHash))
      .limit(1);

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new Error("Invalid or expired refresh token");
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    if (!user) {
      throw new Error("User not found");
    }

    await db.delete(refreshTokens).where(eq(refreshTokens.id, storedToken.id));

    const newAccessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      status: user.status,
    });

    const newRefreshToken = generateRefreshToken(user.id);
    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db.insert(refreshTokens).values({
      userId: user.id,
      tokenHash: hashToken(newRefreshToken),
      expiresAt: refreshTokenExpiry,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async verifyEmail(token: string): Promise<void> {
    const tokenHash = hashToken(token);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.emailVerificationToken, tokenHash))
      .limit(1);

    if (!user) {
      throw new Error("Invalid verification token");
    }

    await db
      .update(users)
      .set({
        status: "active",
        emailVerifiedAt: new Date(),
        emailVerificationToken: null,
      })
      .where(eq(users.id, user.id));
  }

  async switchRole(userId: string, newRole: string): Promise<void> {
    // 1. Update user role in database
    await db
      .update(users)
      .set({
        role: newRole as UserRole,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    // 2. REVOKE ALL EXISTING REFRESH TOKENS
    await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));

    // 3. Optional: Log the role change for audit
    console.log(
      `User ${userId} role changed to ${newRole} - all tokens revoked`
    );
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);

    if (!user) {
      // Don't reveal if email exists or not for security
      return;
    }

    const resetToken = generateResetToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await db
      .update(users)
      .set({
        passwordResetToken: hashToken(resetToken),
        passwordResetExpiresAt: expiresAt,
      })
      .where(eq(users.id, user.id));

    // Get user profile for first name
    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, user.id))
      .limit(1);

    // Send password reset email
    try {
      await emailService.sendPasswordResetEmail(
        user.email,
        resetToken,
        profile?.firstName || undefined
      );
    } catch (error) {
      console.error("Failed to send password reset email:", error);
      throw new Error("Failed to send password reset email");
    }
  }

  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    const hashedToken = hashToken(data.token);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.passwordResetToken, hashedToken))
      .limit(1);

    if (!user || !user.passwordResetExpiresAt) {
      throw new Error("Invalid or expired reset token");
    }

    if (new Date() > user.passwordResetExpiresAt) {
      throw new Error("Reset token has expired");
    }

    const hashedPassword = await hashPassword(data.password);

    await db
      .update(users)
      .set({
        passwordHash: hashedPassword,
        passwordResetToken: null,
        passwordResetExpiresAt: null,
      })
      .where(eq(users.id, user.id));
  }

  async resendVerificationEmail(email: string): Promise<void> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.status === "active") {
      throw new Error("Email is already verified");
    }

    const verificationToken = generateVerificationToken();

    await db
      .update(users)
      .set({
        emailVerificationToken: hashToken(verificationToken),
      })
      .where(eq(users.id, user.id));

    // Get user profile for first name
    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, user.id))
      .limit(1);

    // Send verification email
    try {
      await emailService.sendVerificationEmail(
        user.email,
        verificationToken,
        profile?.firstName || undefined
      );
    } catch (error) {
      console.error("Failed to send verification email:", error);
      throw new Error("Failed to send verification email");
    }
  }
}
