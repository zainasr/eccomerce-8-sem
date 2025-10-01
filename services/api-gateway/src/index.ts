import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const app = express();

const PORT = process.env.PORT || process.env.API_GATEWAY_PORT || 3000;

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || [
      "http://localhost:3001",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || "http://localhost:3001";

app.use(
  "/api/auth",
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api/auth": "/auth",
    },
  })
);

app.use(express.json());

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
