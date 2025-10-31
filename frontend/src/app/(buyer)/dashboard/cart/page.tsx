'use client';



import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, ShoppingCart, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { useCartStore } from '@/store/cart.store';
import { API_URL, ROUTES } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
console.log("stripePromise", stripePromise);

export default function CartPage() {
  const router = useRouter();
  const { cart, setCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch(`${API_URL}/cart`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setCart(data.data.cart);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    
    try {
      const response = await fetch(`${API_URL}/cart/items/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ quantity }),
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.data.cart);
      } else {
        const error = await response.json();
        toast.error('Failed', {
          description: error.message || 'Could not update quantity',
        });
      }
    } catch (error: unknown) {
      toast.error('Error Occurred', {
        description: error instanceof Error ? error.message : 'Something went wrong',
      });
    }
  };

  const removeItem = async (productId: string) => {
    try {
      const response = await fetch(`${API_URL}/cart/items/${productId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.data.cart);
        toast.success('Removed', {
          description: 'Item removed from cart',
        });
      }
    } catch (error: unknown) {
      toast.error('Error Occurred', {
        description: error instanceof Error ? error.message : 'Could not remove item',
      });
    }
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/checkout/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          savePaymentMethod: false 
        }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        toast.error('Checkout Failed', {
          description: error.message || 'Could not initialize checkout',
        });
        return;
      }
  
      const result = await response.json();
      const { url } = result.data || {};
  
      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        toast.error('Checkout Failed', { description: 'Invalid checkout session' });
      }
    } catch (error: unknown) {
      toast.error('Error Occurred', {
        description: error instanceof Error ? error.message : 'Something went wrong',
      });
      setIsLoading(false);
    }
  };

  const totalAmount = cart?.items.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  ) || 0;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">Your cart is empty</p>
            <p className="text-muted-foreground mb-4">Add some products to get started</p>
            <Button onClick={() => router.push(ROUTES.PRODUCTS)}>
              Browse Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-24 h-24 relative bg-slate-100 rounded-md overflow-hidden flex-shrink-0">
                    {/* Add product image here if available */}
                  </div>

                  <div className="flex-1">
                    <p className="text-lg font-bold text-primary">
                      {item.productId}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(item.price)}
                    </p>

                    <div className="flex items-center gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                        className="w-20 text-center"
                        min="1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.productId)}
                        className="ml-auto"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Items ({cart.items.length})</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
              </div>

              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={isLoading}
              >
                {isLoading ? 'Redirecting to Checkout...' : 'Proceed to Checkout'}
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                You&apos;ll be redirected to Stripe&apos;s secure checkout
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}