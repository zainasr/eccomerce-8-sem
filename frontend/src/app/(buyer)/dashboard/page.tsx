import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, ShoppingCart, ArrowRight } from 'lucide-react';
import { API_URL, ROUTES } from '@/lib/constants';
import { Order } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

async function getRecentOrders(): Promise<Order[]> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll()
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ');

    const response = await fetch(`${API_URL}/orders?limit=5`, {
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    });
    
    if (!response.ok) return [];
    const data = await response.json();
    return data.data.orders || [];
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return [];
  }
}

export default async function BuyerDashboardPage() {
  const recentOrders = await getRecentOrders();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your buyer dashboard</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentOrders.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href={ROUTES.PRODUCTS}>
              <Button variant="outline" className="w-full">Browse Products</Button>
            </Link>
            <Link href={ROUTES.CART}>
              <Button variant="outline" className="w-full">View Cart</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Link href={ROUTES.ORDERS}>
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div>
                    <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatPrice(order.totalAmount)}</p>
                    <p className="text-sm capitalize text-muted-foreground">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No orders yet</p>
              <Link href={ROUTES.PRODUCTS}>
                <Button>Start Shopping</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}