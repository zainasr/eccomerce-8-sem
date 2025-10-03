import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import { Pool } from "pg";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "auth-service" });
});

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
