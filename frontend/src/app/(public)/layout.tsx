'use client';

import { useEffect } from 'react';
import { Header } from '@/components/layouts/Header';
import { useAuth } from '@/hooks/useAuth';
import { useCartStore } from '@/store/cart.store';
import { API_URL } from '@/lib/constants';
import { Footer } from '@/components/layouts/Footer';

export default function PublicLayout({ children }: { children: React.ReactNode; }) {
  const { user } = useAuth();
  const { setCart } = useCartStore();

  useEffect(() => {
    async function fetchCart() {
      if (user && user.role === 'buyer') {
        try {
          const response = await fetch(`${API_URL}/cart`, { credentials: 'include' });
          if (response.ok) {
            const cartres = await response.json();
            const cart = cartres.data.cart;
            setCart(cart);
          }
        } catch (error) {
          console.error('Failed to fetch cart:', error);
        }
      } else {
        setCart(null);
      }
    }
    fetchCart();
  }, [user, setCart]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="content" role="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}