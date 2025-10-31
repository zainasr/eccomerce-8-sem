"use client";

import { AlertCircle } from 'lucide-react';
import Link from "next/link";
import { Button } from '@/components/ui/button';

export default function PaymentFailedPage() {
  return (
    <div className="text-center max-w-xl mx-auto py-20">
      <AlertCircle className="h-20 w-20 mx-auto text-red-500 mb-4" />
      <div className="text-2xl font-bold mb-2">Payment Not Complete</div>
      <div className="text-muted-foreground mb-2">
        Your payment was cancelled or failed. No funds were collected and no order was created.
      </div>
      <div className="mb-2">
        If you cancelled: you can retry checkout anytime.
        <br/>
        If your payment failed: please check your card or try a different payment method.
      </div>
      <Link href="/dashboard/cart">
        <Button size="lg" className="mt-4">Back to Cart</Button>
      </Link>
    </div>
  );
}
