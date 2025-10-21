
import { Request, Response } from "express";
import { CheckoutService } from "../services/checkout.service";

const checkoutService = new CheckoutService();

export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const paymentIntent = await checkoutService.createCheckoutSession(
      userId,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Payment intent created successfully",
      data: paymentIntent,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create payment intent",
    });
  }
};