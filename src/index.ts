
import dotenv from "dotenv";

dotenv.config();


import express from "express";
import helmet from "helmet";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import productRoutes from "./routes/product.routes";
import cookieParser from "cookie-parser";
import orderRoutes from "./routes/order.route";
import cartRoutes from "./routes/cart.routes";
import checkoutRoutes from "./routes/checkout.routes";
import paymentRoutes from "./routes/payment.route";
import { handleStripeWebhook } from "./controllers/webhook.controller";
import { db } from "./database/connection";

const app = express();

app.use(cookieParser());
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));


app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
  }));


  app.use("/api/payments/webhooks", express.raw({ type: "application/json" }), handleStripeWebhook);



app.use(express.json());
const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/payments", paymentRoutes);
app.get("/health", (req, res) => {
    res.json({ status: "OK", service: "eccomerce app" });
});
app.get("/health/db", async (req, res) => {
    const result = await db.execute("SELECT 1");
    res.json({ status: "OK", data: result });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Error:", err);
    
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Internal server error",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });
});

app.all("*", (req, res) => {
    res.status(404).json({
      success: false,
      message: "Route not found",
      path: req.originalUrl,
      method: req.method
    });
  });
  
  

app.listen(PORT, () => {
    console.log(`eccomerce-api running on port ${PORT}`);
});


