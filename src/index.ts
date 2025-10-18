import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import productRoutes from "./routes/product.routes";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();


app.use(cookieParser());
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Important for development
    contentSecurityPolicy: false // You can configure this properly later
}));


// More permissive CORS for developme
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
  }));



app.use(express.json());
const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.get("/health", (req, res) => {
    res.json({ status: "OK", service: "eccomerce app" });
});

app.all("*", (_, res) => {
    res.json("not found sorry")
})

app.listen(PORT, () => {
    console.log(`eccomerce-api running on port ${PORT}`);
});


