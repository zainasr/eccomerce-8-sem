import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/server-auth';
import Link from 'next/link';
import { Home, Package, ShoppingCart, BarChart } from 'lucide-react';

export default async function SellerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUser();

  if (!user || user.role !== 'seller') {
    redirect('/');
  }

  return (
    <div className="flex flex-1">
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-600 to-accent-600"></div>
            <span className="text-xl font-bold text-gradient">MarketPlace</span>
          </Link>
        </div>
        <nav className="space-y-2 p-4">
          <Link
            href="/seller-dashboard"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Home className="h-5 w-5" />
            <span>Overview</span>
          </Link>
          <Link
            href="/seller-dashboard/products"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Package className="h-5 w-5" />
            <span>Products</span>
          </Link>
          <Link
            href="/seller-dashboard/orders"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Orders</span>
          </Link>
          <Link
            href="/seller-dashboard/analytics"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <BarChart className="h-5 w-5" />
            <span>Analytics</span>
          </Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}