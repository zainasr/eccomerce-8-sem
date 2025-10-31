import { Metadata } from 'next';
import { API_URL } from '@/lib/constants';
import { cookies } from 'next/headers';
import { formatPrice } from '@/lib/utils';
import { Users, Package, ShoppingBag, DollarSign } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Analytics | Admin Dashboard | ShopHub',
  description: 'View detailed analytics for your store',
};

export const dynamic = 'force-dynamic';

async function getAnalytics() {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');
    const response = await fetch(`${API_URL}/admin/analytics`, {
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.data || null;
  } catch {
    return null;
  }
}

function RevenueBarChart({ revenueByMonth }: { revenueByMonth: { month: string, revenue: number }[] }) {
  const last6 = revenueByMonth.slice(-6);
  const maxVal = Math.max(...last6.map(r => r.revenue), 1);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 items-end h-36">
        {last6.map((m) => (
          <div key={m.month} className="flex flex-col items-center justify-end">
            <div className="w-7 md:w-10 bg-primary rounded-t" style={{ height: `${Math.max((m.revenue/maxVal)*120,10)}px` }} title={formatPrice(m.revenue)} />
            <span className="text-xs mt-1 text-text-secondary">{m.month.split('-').slice(1).join('/')}</span>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-text-secondary">
              <th className="text-left font-medium py-1">Month</th>
              <th className="text-right font-medium py-1">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {last6.map((m) => (
              <tr key={m.month} className="border-t border-border">
                <td className="py-1">{m.month}</td>
                <td className="py-1 text-right">{formatPrice(m.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProgressBar({ value, max }: { value: number; max: number; }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div className="w-28 md:w-40">
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-2 bg-primary" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default async function AdminAnalyticsPage() {
  const analytics = await getAnalytics();

  const totalUsers = analytics?.totalUsers || 0;
  const totalBuyers = analytics?.totalBuyers || 0;
  const totalOrders = analytics?.totalOrders || 0;
  const totalRevenue = analytics?.totalRevenue || 0;
  const totalProducts = analytics?.totalProducts || 0;
  const revenueByMonth = analytics?.revenueByMonth || [];
  const topProducts = analytics?.topProducts || [];

  const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0; // average order value
  const buyerRatio = totalUsers > 0 ? Math.round((totalBuyers / totalUsers) * 100) : 0; // % buyers

  const cards = [
    { title: 'Total Users', value: totalUsers, icon: Users },
    { title: 'Total Buyers', value: totalBuyers, icon: Users },
    { title: 'Total Orders', value: totalOrders, icon: ShoppingBag },
    { title: 'Total Revenue', value: formatPrice(totalRevenue), icon: DollarSign },
    { title: 'Total Products', value: totalProducts, icon: Package },
    { title: 'Avg. Order Value', value: formatPrice(aov), icon: DollarSign },
    { title: 'Buyer Ratio', value: `${buyerRatio}%`, icon: Users },
  ];

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-0">
      <header>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Analytics</h1>
        <p className="text-text-secondary mt-2 text-sm sm:text-base">Data-driven overview of your store</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.title} className="bg-white rounded-lg border border-border p-6 flex items-center gap-4">
              <div className="shrink-0"><Icon className="h-6 w-6 text-primary" /></div>
              <div className="min-w-0">
                <div className="text-sm text-text-secondary">{c.title}</div>
                <div className="text-2xl font-bold truncate">{c.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts + Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-border p-4 sm:p-6">
          <h3 className="text-lg font-semibold mb-2">Monthly Revenue</h3>
          {revenueByMonth.length > 0 ? (
            <RevenueBarChart revenueByMonth={revenueByMonth} />
          ) : (
            <p className="text-text-secondary text-sm">No revenue data.</p>
          )}
        </div>

        <div className="bg-white rounded-lg border border-border p-4 sm:p-6">
          <h3 className="text-lg font-semibold mb-2">Top Products</h3>
          {topProducts.length > 0 ? (
            <div className="space-y-3">
              {(() => { const maxSold = Math.max(...topProducts.map((p: { totalSold: number; }) => p.totalSold), 1); return (
                <>
                  {topProducts.slice(0, 7).map((p: { productId: string; productName: string; totalSold: number; }, i: number) => (
                    <div key={p.productId} className="flex items-center justify-between gap-2 py-2 border-b border-border last:border-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs text-text-secondary shrink-0">#{i+1}</span>
                        <span className="text-sm font-medium truncate max-w-[12rem] sm:max-w-[16rem]">{p.productName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-primary font-semibold">{p.totalSold}</span>
                        <ProgressBar value={p.totalSold} max={maxSold} />
                      </div>
                    </div>
                  ))}
                </>
              )})()}
            </div>
          ) : (
            <p className="text-text-secondary text-sm">No sales data yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

