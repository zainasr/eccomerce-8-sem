import jwt from "jsonwebtoken";
import { JWTPayload } from "../types/auth";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key";
const ACCESS_TOKEN_EXPIRES_IN = "15m";

export const generateAccessToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
};

export const verifyAccessToken = (token: string): JWTPayload => {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
};