import { Metadata } from 'next';
import { Users, Package, ShoppingBag, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { API_URL } from '@/lib/constants';
import { cookies } from 'next/headers';
import { formatPrice } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Admin Dashboard | ShopHub',
  description: 'Manage your e-commerce store',
};

async function getAnalytics() {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll()
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ');

    const response = await fetch(`${API_URL}/admin/analytics`, {
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    });
    
    if (!response.ok) return null;
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return null;
  }
}

export default async function AdminDashboardPage() {
  const analytics = await getAnalytics();

  const stats = [
    {
      title: 'Total Users',
      value: analytics?.totalUsers || 0,
      icon: Users,
      trend: null,
    },
    {
      title: 'Total Orders',
      value: analytics?.totalOrders || 0,
      icon: ShoppingBag,
      trend: null,
    },
    {
      title: 'Total Revenue',
      value: formatPrice(analytics?.totalRevenue || 0),
      icon: DollarSign,
      trend: null,
    },
    {
      title: 'Total Products',
      value: analytics?.totalProducts || 0,
      icon: Package,
      trend: null,
    },
  ];

  return (
    <div className="space-y-6 px-4 sm:px-6">
      <header className="mb-2 sm:mb-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-text-secondary mt-2">Welcome back! Here&apos;s what&apos;s happening with your store.</p>
      </header>

      {/* Stats Grid - fills width, consistent heights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-lg border border-border p-5 hover:shadow-md transition-shadow h-full">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-text-secondary">{stat.title}</p>
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="text-3xl font-bold text-text">{stat.value}</div>
              {stat.trend && (
                <p className={`text-xs mt-2 flex items-center gap-1 ${stat.trend > 0 ? 'text-success' : 'text-error'}`}>
                  {stat.trend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(stat.trend)}% from last month
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Two-column content on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-lg border border-border p-4 sm:p-6">
          <h3 className="text-lg font-semibold mb-4">Top Products</h3>
          {analytics?.topProducts && analytics.topProducts.length > 0 ? (
            <div className="space-y-3">
              {analytics.topProducts.slice(0, 5).map((product, index) => (
                <div key={product.productId} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <span className="text-xs sm:text-sm font-medium text-text-secondary flex-shrink-0">#{index + 1}</span>
                    <span className="text-xs sm:text-sm font-medium text-text truncate">{product.productName}</span>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-primary ml-2 flex-shrink-0">
                    {formatPrice(product.totalSold)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-secondary text-sm">No sales data yet</p>
          )}
        </div>

        {/* Revenue Overview */}
        <div className="bg-white rounded-lg border border-border p-4 sm:p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
          {analytics?.revenueByMonth && analytics.revenueByMonth.length > 0 ? (
            <div className="space-y-3">
              {analytics.revenueByMonth.slice(-6).map((month) => (
                <div key={month.month} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-xs sm:text-sm text-text-secondary">{month.month}</span>
                  <span className="text-xs sm:text-sm font-semibold text-text">
                    {formatPrice(month.revenue)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-secondary text-sm">No revenue data yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

