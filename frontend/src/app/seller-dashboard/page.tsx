import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getServerUser } from '@/lib/server-auth';
import { BarChart, Package, ShoppingCart } from 'lucide-react';
import { redirect } from 'next/navigation';

// Mock function - replace with actual API call
async function fetchOverviewData(sellerId: string) {
  console.log("sellerId", sellerId);
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    totalProducts: 150,
    totalOrders: 45,
    revenue: 12500.00,
    recentOrders: [
      { id: '1', customer: 'John Doe', date: '2023-10-01', amount: 250.00, status: 'delivered' },
      { id: '2', customer: 'Jane Smith', date: '2023-10-02', amount: 180.00, status: 'processing' },
      { id: '3', customer: 'Alice Johnson', date: '2023-10-03', amount: 320.00, status: 'shipped' },
      { id: '4', customer: 'Bob Brown', date: '2023-10-04', amount: 210.00, status: 'delivered' },
      { id: '5', customer: 'Charlie Wilson', date: '2023-10-05', amount: 95.00, status: 'cancelled' },
    ],
  };
}

export default async function SellerDashboardPage() {
  const user = await getServerUser();

  if (!user || user.role !== 'seller') {
    redirect('/');
  }

  const overviewData = await fetchOverviewData(user.id);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Seller Dashboard</h1>
        <p className="text-secondary-600">Welcome back, {user.username}!</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewData.totalProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewData.totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${overviewData.revenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {overviewData.recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>${order.amount}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'processing'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}