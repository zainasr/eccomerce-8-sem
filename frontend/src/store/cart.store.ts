'use client';

import { create } from 'zustand';
import { Cart } from '@/types';

interface CartState {
  cart: Cart | null;
  itemCount: number;
  setCart: (cart: Cart | null) => void;
  updateItemCount: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  itemCount: 0,
  setCart: (cart) => {
    set({ cart });
    get().updateItemCount();
  },
  updateItemCount: () => {
    const cart = get().cart;
    const count = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
    set({ itemCount: count });
  },
}));