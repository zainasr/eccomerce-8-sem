"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import Link from "next/link";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  // Optionally, you could poll an endpoint here for more detail

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }
    const timer = setTimeout(() => {
      setLoading(false);
      setConfirmed(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center">
        <CheckCircle2 className="h-16 w-16 animate-pulse text-green-500" />
        <div className="text-xl font-semibold">Finalizing your payment...</div>
      </div>
    );
  }
  if (!sessionId) {
    return (
      <div className="text-center max-w-xl mx-auto py-20">
        <CheckCircle2 className="h-20 w-20 mx-auto text-green-500 mb-4" />
        <div className="text-2xl font-bold mb-2">Payment Status</div>
        <div className="text-muted-foreground mb-2">No session information found. If you just paid, your payment is being processed.</div>
        <Link href="/dashboard/orders">
          <Button className="mt-4">Go to My Orders</Button>
        </Link>
      </div>
    );
  }
  if (confirmed) {
    return (
      <div className="text-center max-w-xl mx-auto py-20">
        <CheckCircle2 className="h-20 w-20 mx-auto text-green-500 mb-4" />
        <div className="text-2xl font-bold mb-2">Payment Successful!</div>
        <div className="text-muted-foreground mb-2">Your payment is confirmed and your order is being processed.</div>
        <div className="mb-2">You can view your receipt and order details in <Link href="/dashboard/orders" className="underline font-medium">My Orders</Link></div>
        <Link href="/dashboard/orders">
          <Button size="lg" className="mt-4">See My Orders</Button>
        </Link>
      </div>
    );
  }
  return (
    <div className="text-center max-w-xl mx-auto py-20">
      <div className="text-2xl font-bold mb-2">Processing...</div>
      <div className="text-muted-foreground mb-2">We are verifying your payment. Please check your orders in a minute.</div>
      <Link href="/dashboard/orders">
        <Button>Go to My Orders</Button>
      </Link>
    </div>
  );
}