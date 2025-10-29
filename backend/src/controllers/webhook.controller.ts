import { Request, Response } from "express";
import { PaymentService } from "../services/payment.service";
import { CheckoutService } from "../services/checkout.service";
import Stripe from "stripe";
import { stripe } from "../config/stripe";


const paymentService = new PaymentService();
const checkoutService = new CheckoutService();

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    return res.status(400).json({
      success: false,
      message: "Missing stripe signature",
    });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return res.status(400).json({
      success: false,
      message: "Invalid signature",
    });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await paymentService.handlePaymentSuccess(paymentIntent.id);
        
        // Create orders after successful payment
        const shippingAddress = paymentIntent.shipping?.address 
          ? `${paymentIntent.shipping.address.line1}, ${paymentIntent.shipping.address.city}, ${paymentIntent.shipping.address.state} ${paymentIntent.shipping.address.postal_code}, ${paymentIntent.shipping.address.country}`
          : "123 Default Address, City, State 12345, US";
          
        await checkoutService.processSuccessfulPayment(
          paymentIntent.id,
          shippingAddress
        );
        break;

      case "payment_intent.payment_failed":
        const failedIntent = event.data.object as Stripe.PaymentIntent;
        await paymentService.handlePaymentFailure(failedIntent.id);
        break;

      case "charge.refunded":
        const refund = event.data.object as Stripe.Charge;
        // Refund already handled in refundPayment method
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    res.status(500).json({
      success: false,
      message: "Webhook handler failed",
    });
  }
};