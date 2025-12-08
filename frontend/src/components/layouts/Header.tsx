'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, User, LogOut, Package, Store, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { API_URL, ROUTES } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';

export function Header() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { itemCount } = useCartStore();

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
      logout();
      router.push(ROUTES.HOME);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const goToDashboard = () => {
    if (!user) return;
    if (user.role === 'admin') router.push(ROUTES.ADMIN_DASHBOARD);
    else router.push(ROUTES.DASHBOARD);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white shadow-sm">
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Store className="h-7 w-7 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">ShopHub</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href={ROUTES.HOME} className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Home</Link>
            <Link href={ROUTES.PRODUCTS} className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Products</Link>
            <Link href={ROUTES.BLOGS} className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Blogs</Link>
            {user?.role === 'admin' && (
              <Link href={ROUTES.ADMIN_DASHBOARD} className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Admin</Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {user && (
              <Link href={ROUTES.CART}>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary">{itemCount}</Badge>
                  )}
                </Button>
              </Link>
            )}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 z-[1000]">
                  <div className="flex flex-col gap-1 p-3">
                    <p className="text-sm font-medium text-text">{user.username}</p>
                    <p className="text-xs text-text-muted">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={goToDashboard} className="hover:text-white">
                    <LayoutDashboard className="mr-2 h-4 w-4 rounded-md" />
                      {user.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-error">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => router.push(ROUTES.LOGIN)} className="text-text-secondary">Login</Button>
                <Button size="sm" onClick={() => router.push(ROUTES.REGISTER)}>
                  {/* default variant ensures white text and black hover */}
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}