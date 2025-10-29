import { Request, Response } from "express";
import { CheckoutService } from "../services/checkout.service";

const checkoutService = new CheckoutService();

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { sessionUrl } = await checkoutService.createCheckoutSession(userId);

    res.status(201).json({
      success: true,
      message: "Checkout session created successfully",
      data: { url: sessionUrl },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create checkout session",
    });
  }
};