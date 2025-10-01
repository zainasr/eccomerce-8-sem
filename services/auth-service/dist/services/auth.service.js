"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const shared_1 = require("shared");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const username_1 = require("../utils/username");
const tokens_1 = require("../utils/tokens");
class AuthService {
    async register(data) {
        const existingUser = await shared_1.db
            .select()
            .from(shared_1.users)
            .where((0, drizzle_orm_1.eq)(shared_1.users.email, data.email))
            .limit(1);
        if (existingUser.length > 0) {
            throw new Error("Email already exists");
        }
        const hashedPassword = await (0, password_1.hashPassword)(data.password);
        const username = data.firstName && data.lastName
            ? (0, username_1.generateUsername)(data.firstName, data.lastName)
            : (0, username_1.generateUsernameFromEmail)(data.email);
        const verificationToken = (0, tokens_1.generateVerificationToken)();
        const [newUser] = await shared_1.db
            .insert(shared_1.users)
            .values({
            email: data.email,
            username,
            passwordHash: hashedPassword,
            emailVerificationToken: (0, tokens_1.hashToken)(verificationToken),
        })
            .returning();
        if (data.firstName || data.lastName) {
            await shared_1.db.insert(shared_1.userProfiles).values({
                userId: newUser.id,
                firstName: data.firstName,
                lastName: data.lastName,
                profilePicture: `https://api.dicebear.com/7.x/initials/svg?seed=${data.firstName}${data.lastName}`,
            });
        }
        return { user: newUser, verificationToken };
    }
    async login(data) {
        const [user] = await shared_1.db
            .select()
            .from(shared_1.users)
            .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(shared_1.users.email, data.identifier), (0, drizzle_orm_1.eq)(shared_1.users.username, data.identifier)))
            .limit(1);
        if (!user) {
            throw new Error("Invalid credentials");
        }
        const isValidPassword = await (0, password_1.verifyPassword)(data.password, user.passwordHash);
        if (!isValidPassword) {
            throw new Error("Invalid credentials");
        }
        if (user.status === "pending_verification") {
            throw new Error("Please verify your email first");
        }
        if (user.status === "suspended") {
            throw new Error("Account is suspended");
        }
        const [profile] = await shared_1.db
            .select()
            .from(shared_1.userProfiles)
            .where((0, drizzle_orm_1.eq)(shared_1.userProfiles.userId, user.id))
            .limit(1);
        const accessToken = (0, jwt_1.generateAccessToken)({
            userId: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            status: user.status,
        });
        const refreshToken = (0, jwt_1.generateRefreshToken)(user.id);
        const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await shared_1.db.insert(shared_1.refreshTokens).values({
            userId: user.id,
            tokenHash: (0, tokens_1.hashToken)(refreshToken),
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
    async refreshToken(token) {
        const { userId } = (0, jwt_1.verifyRefreshToken)(token);
        const tokenHash = (0, tokens_1.hashToken)(token);
        const [storedToken] = await shared_1.db
            .select()
            .from(shared_1.refreshTokens)
            .where((0, drizzle_orm_1.eq)(shared_1.refreshTokens.tokenHash, tokenHash))
            .limit(1);
        if (!storedToken || storedToken.expiresAt < new Date()) {
            throw new Error("Invalid or expired refresh token");
        }
        const [user] = await shared_1.db
            .select()
            .from(shared_1.users)
            .where((0, drizzle_orm_1.eq)(shared_1.users.id, userId))
            .limit(1);
        if (!user) {
            throw new Error("User not found");
        }
        await shared_1.db.delete(shared_1.refreshTokens).where((0, drizzle_orm_1.eq)(shared_1.refreshTokens.id, storedToken.id));
        const newAccessToken = (0, jwt_1.generateAccessToken)({
            userId: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            status: user.status,
        });
        const newRefreshToken = (0, jwt_1.generateRefreshToken)(user.id);
        const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await shared_1.db.insert(shared_1.refreshTokens).values({
            userId: user.id,
            tokenHash: (0, tokens_1.hashToken)(newRefreshToken),
            expiresAt: refreshTokenExpiry,
        });
        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    }
    async verifyEmail(token) {
        const tokenHash = (0, tokens_1.hashToken)(token);
        const [user] = await shared_1.db
            .select()
            .from(shared_1.users)
            .where((0, drizzle_orm_1.eq)(shared_1.users.emailVerificationToken, tokenHash))
            .limit(1);
        if (!user) {
            throw new Error("Invalid verification token");
        }
        await shared_1.db
            .update(shared_1.users)
            .set({
            status: "active",
            emailVerifiedAt: new Date(),
            emailVerificationToken: null,
        })
            .where((0, drizzle_orm_1.eq)(shared_1.users.id, user.id));
    }
    async switchRole(userId, role) {
        if (role === "admin") {
            throw new Error("Cannot switch to admin role");
        }
        await shared_1.db.update(shared_1.users).set({ role }).where((0, drizzle_orm_1.eq)(shared_1.users.id, userId));
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map