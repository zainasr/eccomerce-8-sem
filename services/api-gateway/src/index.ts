import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use(helmet());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL;

// Auth service proxy
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

// Product service proxy
app.use(
  "/api/products",
  createProxyMiddleware({
    target: PRODUCT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api/products": "/products",
    },
  })
);

// Category service proxy
app.use(
  "/api/categories",
  createProxyMiddleware({
    target: PRODUCT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api/categories": "/categories",
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
      products: "/api/products/*",
      categories: "/api/categories/*",
      health: "/health",
    },
  });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
