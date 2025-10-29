import { eq } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import { db } from "../database/connection";
import { users } from "../database/schemas/auth";
import { JWTPayload } from "../types/auth";
import { verifyAccessToken } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token || 
               (req.headers.authorization && req.headers.authorization.split(" ")[1]);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token required",
    });
  }

  try {
    const decoded = verifyAccessToken(token);

    // Check tokenVersion freshness against DB
    const [user] = await db
      .select({ tokenVersion: users.tokenVersion })
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1);

    if (!user || (user.tokenVersion ?? 0) !== (decoded.tokenVersion ?? 0)) {
      res.clearCookie('access_token');
      return res.status(401).json({
        success: false,
        message: "Token is no longer valid. Please sign in again.",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    // Clear invalid token
    res.clearCookie('access_token');
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
    }

    next();
  };
};