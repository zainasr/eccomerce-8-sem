import { Metadata } from 'next';
import { Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Manage Users | Admin Dashboard | ShopHub',
  description: 'Manage users in your store',
};

export default function AdminUsersPage() {
  return (
    <div className="space-y-4 md:space-y-6 px-4 sm:px-6 lg:px-0">
      <header>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">User Management</h1>
        <p className="text-text-secondary mt-2 text-sm sm:text-base">Manage all users in your platform</p>
      </header>

      <div className="bg-white rounded-lg border border-border p-8 sm:p-12 text-center">
        <Users className="h-12 w-12 sm:h-16 sm:w-16 text-slate-300 mx-auto mb-4" />
        <p className="text-text-secondary text-sm sm:text-base">User management interface coming soon</p>
      </div>
    </div>
  );
}

