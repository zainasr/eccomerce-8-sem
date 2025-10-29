'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner"
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { API_URL, ROUTES } from '@/lib/constants';
import { Product } from '@/types';

export function AddToCartButton({ product }: { product: Product }) {
  const router = useRouter();
    const { user } = useAuthStore();
  const { setCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      toast("Login Required", {
        description: 'Please login to add items to cart',
      });
      router.push(ROUTES.LOGIN);
      return;
    }

    if (user.role !== 'buyer') {
      toast("Buyers Only", {
        description: 'Only buyers can add items to cart',
      });
      return;
    }

    if (product.stockQuantity === 0) {
      toast("Out of Stock", {
        description: 'This product is currently unavailable',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/cart/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
        }),
      });

      if (response.ok) {
        const cart = await response.json();
        setCart(cart.data.cart);
        toast("Added to Cart", {
          description: `${product.name} has been added to your cart`,
        });
      } else {
        const error = await response.json();
        toast("Failed", {
          description: error.message || 'Could not add to cart',
        });
      }
    } catch (error) {
      toast("Error Occurred", {
        description: error.message || 'Something went wrong',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      size="lg"
      className="w-full"
      onClick={handleAddToCart}
      disabled={isLoading || product.stockQuantity === 0}
    >
      <ShoppingCart className="mr-2 h-5 w-5" />
      {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
    </Button>
  );
}