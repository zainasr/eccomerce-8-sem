import { Metadata } from 'next';
import { BarChart3 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Analytics | Admin Dashboard | ShopHub',
  description: 'View detailed analytics for your store',
};

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-4 md:space-y-6 px-4 sm:px-6 lg:px-0">
      <header>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Analytics</h1>
        <p className="text-text-secondary mt-2 text-sm sm:text-base">Detailed insights about your store</p>
      </header>

      <div className="bg-white rounded-lg border border-border p-8 sm:p-12 text-center">
        <BarChart3 className="h-12 w-12 sm:h-16 sm:w-16 text-slate-300 mx-auto mb-4" />
        <p className="text-text-secondary text-sm sm:text-base">Detailed analytics interface coming soon</p>
      </div>
    </div>
  );
}

