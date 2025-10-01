"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post("/register", auth_controller_1.register);
router.post("/login", auth_controller_1.login);
router.post("/refresh", auth_controller_1.refreshToken);
router.get("/verify/:token", auth_controller_1.verifyEmail);
router.post("/switch-role", auth_middleware_1.authenticateToken, auth_controller_1.switchRole);
router.get("/me", auth_middleware_1.authenticateToken, auth_controller_1.getProfile);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map