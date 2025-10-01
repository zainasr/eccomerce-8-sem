"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || process.env.API_GATEWAY_PORT || 3000;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN?.split(",") || [
        "http://localhost:3001",
        "http://localhost:3000",
    ],
    credentials: true,
}));
app.use(express_1.default.json());
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://localhost:3001";
app.use("/api/auth", (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        "^/api/auth": "/auth",
    },
}));
app.get("/health", (req, res) => {
    res.json({ status: "OK", service: "api-gateway" });
});
app.get("/", (req, res) => {
    res.json({
        message: "E-commerce API Gateway",
        version: "1.0.0",
        endpoints: {
            auth: "/api/auth/*",
            health: "/health",
        },
    });
});
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map