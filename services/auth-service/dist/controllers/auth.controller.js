"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.switchRole = exports.verifyEmail = exports.refreshToken = exports.login = exports.register = void 0;
const shared_1 = require("shared");
const auth_service_1 = require("../services/auth.service");
const authService = new auth_service_1.AuthService();
const register = async (req, res) => {
    try {
        const data = shared_1.registerSchema.parse(req.body);
        const { user, verificationToken } = await authService.register(data);
        res.status(201).json({
            success: true,
            message: "Registration successful. Please check your email for verification.",
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                },
                verificationToken,
            },
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Registration failed",
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const data = shared_1.loginSchema.parse(req.body);
        const authResponse = await authService.login(data);
        res.json({
            success: true,
            message: "Login successful",
            data: authResponse,
        });
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: error instanceof Error ? error.message : "Login failed",
        });
    }
};
exports.login = login;
const refreshToken = async (req, res) => {
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
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: error instanceof Error ? error.message : "Token refresh failed",
        });
    }
};
exports.refreshToken = refreshToken;
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        await authService.verifyEmail(token);
        res.json({
            success: true,
            message: "Email verified successfully",
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Email verification failed",
        });
    }
};
exports.verifyEmail = verifyEmail;
const switchRole = async (req, res) => {
    try {
        const data = shared_1.switchRoleSchema.parse(req.body);
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        await authService.switchRole(userId, data.role);
        res.json({
            success: true,
            message: `Role switched to ${data.role} successfully`,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Role switch failed",
        });
    }
};
exports.switchRole = switchRole;
const getProfile = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get profile",
        });
    }
};
exports.getProfile = getProfile;
//# sourceMappingURL=auth.controller.js.map