import { Metadata } from 'next';
import { API_URL } from '@/lib/constants';
import { cookies } from 'next/headers';
import { formatPrice } from '@/lib/utils';
import { DollarSign, Package, ShoppingBag, TrendingDown, Users } from 'lucide-react';
import { TrendingUp } from 'lucide-react';
// import QuickDeleteUser from '@/components/DeleteUser';

export const metadata: Metadata = {
  title: 'Admin Dashboard | ShopHub',
  description: 'Manage your e-commerce store',
};

export const dynamic = 'force-dynamic';

async function getAnalytics() {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll().map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
    const response = await fetch(`${API_URL}/admin/analytics`, { headers: { Cookie: cookieHeader }, cache: 'no-store' });
    if (!response.ok) return null;
    const data = await response.json();
    console.log("data " ,data.data)
    return data.data || null;
  } catch {
    return null;
  }
}

function RevenueTrend({ revenueByMonth }: { revenueByMonth: { month: string, revenue: number }[] }) {
  if (!revenueByMonth || revenueByMonth.length < 2) return null;
  const last = revenueByMonth[revenueByMonth.length-1]?.revenue || 0;
  const prev = revenueByMonth[revenueByMonth.length-2]?.revenue || 0;
  const diff = last - prev;
  const pct = prev === 0 ? 100 : Math.round((diff/prev) * 100);
  return (
    <span className={"flex items-center text-xs gap-1 " + (diff >= 0 ? 'text-success' : 'text-error')}>
      {diff >= 0 ? <TrendingUp className="h-4 w-4"/> : <TrendingDown className="h-4 w-4"/>}
      {Math.abs(pct)}% from last month
    </span>
  );
}



export default async function AdminDashboardPage() {
  const analytics = await getAnalytics();
  const stats = [
    { title: 'Total Users', value: analytics?.totalUsers || 0, icon: Users },
    { title: 'Total Buyers', value: analytics?.totalBuyers || 0, icon: Users },
    { title: 'Total Orders', value: analytics?.totalOrders || 0, icon: ShoppingBag },
    { title: 'Total Revenue', value: formatPrice(analytics?.totalRevenue || 0), icon: DollarSign },
    { title: 'Total Products', value: analytics?.totalProducts || 0, icon: Package },
  ];
  return (
    <div className="space-y-6 px-4 sm:px-6">
      <header className="mb-2 sm:mb-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-text-secondary mt-2">Welcome back! Here what happening with your store.</p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-lg border border-border p-5 hover:shadow-md transition-shadow h-full flex flex-col gap-2 items-center text-center">
              <Icon className="h-6 w-6 text-primary mb-1" />
              <div className="text-xl font-medium text-text mb-1 whitespace-nowrap">{stat.title}</div>
              <div className="text-2xl font-bold text-text">{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* <QuickDeleteUser /> */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-border p-4 sm:p-6 flex flex-col h-full">
          <h3 className="text-lg font-semibold mb-2">Monthly Revenue</h3>
          <RevenueTrend revenueByMonth={analytics?.revenueByMonth || []} />
          {analytics?.revenueByMonth && analytics.revenueByMonth.length > 1 ? (
            <div className="flex items-end gap-2 mt-4 h-32">
              {analytics.revenueByMonth.slice(-6).map((month) => (
                <div key={month.month} className="flex flex-col justify-end items-center flex-1">
                  <div className="w-7 md:w-10 bg-primary rounded-t" style={{height: `${Math.max((month.revenue/Math.max(...analytics.revenueByMonth.map(r=>r.revenue),1))*110,10)}px`, transition:'height .4s'}} title={formatPrice(month.revenue)} />
                  <span className="text-xs mt-1 text-text-secondary whitespace-nowrap">{month.month.split('-').slice(1).join('/')}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-secondary text-sm mt-5">No revenue data yet.</p>
          )}
        </div>
        <div className="bg-white rounded-lg border border-border p-4 sm:p-6 flex flex-col h-full">
          <h3 className="text-lg font-semibold mb-2">Top Products</h3>
          {analytics?.topProducts && analytics.topProducts.length > 0 ? (
            <div className="space-y-3">
              {analytics.topProducts.slice(0, 7).map((p, i) => (
                <div key={p.productId} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="font-medium text-text-secondary text-xs sm:text-sm truncate w-1/2">#{i+1} {p.productName}</span>
                  <span className="text-primary text-xs font-bold">Sold {p.totalSold}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-secondary text-sm">No sales data yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

