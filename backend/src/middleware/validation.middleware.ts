import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";

export const validateRequest = (
  schema: ZodSchema,
  source: "body" | "query" | "params" = "body"
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = schema.parse((req as any)[source]);
      (req as any)[source] = data;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errorMessages,
        });
      }

      return res.status(400).json({
        success: false,
        message: "Invalid request data",
      });
    }
  };
};
