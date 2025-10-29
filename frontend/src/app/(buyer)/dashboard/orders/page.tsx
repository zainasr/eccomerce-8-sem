import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { API_URL, ORDER_STATUS_COLORS } from '@/lib/constants';
import { Order } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { Package } from 'lucide-react';
import { cookies } from 'next/headers';

async function getOrders(): Promise<Order[]> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll()
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ');

    const response = await fetch(`${API_URL}/orders`, {
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

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="text-muted-foreground">Track and manage your orders</p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                    <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                  </div>
                  <Badge className={ORDER_STATUS_COLORS[order.status]}>
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>
                          {item.productId} x {item.quantity}
                        </span>
                        <span className="font-medium">{formatPrice(item.price)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="border-t pt-4 flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatPrice(order.totalAmount)}</span>
                  </div>

                  {/* Seller Info removed for B2C */}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">No orders yet</p>
            <p className="text-muted-foreground">Start shopping to see your orders here</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}