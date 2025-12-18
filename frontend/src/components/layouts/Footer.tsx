import Link from 'next/link';
import { Store } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-6 flex flex-col items-center gap-2">
        <Link href={ROUTES.HOME} className="flex items-center space-x-2 mb-2">
          <Store className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">ShopHub</span>
        </Link>
        <nav className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
          <Link href={ROUTES.PRODUCTS} className="hover:text-primary transition-colors">Products</Link>
          <Link href={ROUTES.BLOGS} className="hover:text-primary transition-colors">Blogs</Link>
          <Link href={ROUTES.ABOUT} className="hover:text-primary transition-colors">About</Link>
          <Link href={ROUTES.CONTACT} className="hover:text-primary transition-colors">Contact</Link>
          <Link href={ROUTES.LOGIN} className="hover:text-primary transition-colors">Login</Link>
          <Link href={ROUTES.REGISTER} className="hover:text-primary transition-colors">Register</Link>
        </nav>
        <p className="text-xs text-muted-foreground py-1">&copy; {currentYear} ShopHub. All rights reserved.</p>
      </div>
    </footer>
  );
}