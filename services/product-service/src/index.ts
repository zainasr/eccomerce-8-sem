import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { createRouteHandler } from "uploadthing/express";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";
import { uploadRouter } from "./uploadthing";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(
  "/api/uploadthing",
  createRouteHandler({
    router: uploadRouter,
  })
);

app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);

app.all("*", (req, res) => {
  return res.send("not found");
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "product-service" });
});

app.listen(PORT, () => {
  console.log(`Product service running on port ${PORT}`);
});
