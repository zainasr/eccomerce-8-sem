"use client";

import { useEffect, useMemo, useState } from "react";
import { API_URL } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Order } from "@/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", "10");
    if (filters.status) params.set("status", filters.status);
    params.set("sortBy", filters.sortBy);
    params.set("sortOrder", filters.sortOrder);
    return params.toString();
  }, [page, filters]);

  useEffect(() => {
    (async function loadOrders() {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/orders?${queryString}`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setOrders(data.data?.orders || []);
          setTotalPages(data.data?.pagination?.totalPages || 1);
        }
      } catch {}
      setIsLoading(false);
    })();
  }, [queryString]);

  return (
    <div className="space-y-4 md:space-y-6 px-4 sm:px-6 lg:px-0">
      <header>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Order Management</h1>
        <p className="text-text-secondary mt-2 text-sm sm:text-base">View and manage all orders</p>
      </header>

      <div className="bg-white rounded-lg border border-border p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="search">Search (Buyer, ID)</Label>
            <Input id="search" placeholder="e.g. order ID, buyer email" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select id="status" className="input" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg border border-border p-8 text-center">Loading...</div>
      ) : orders.length > 0 ? (
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead className="hidden md:table-cell">Buyer</TableHead>
                  <TableHead className="hidden md:table-cell">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o, idx) => (
                  <TableRow key={o.id}>
                    <TableCell>{(page - 1) * 10 + idx + 1}</TableCell>
                    <TableCell className="font-medium">{o.id}</TableCell>
                    <TableCell className="hidden md:table-cell">{o.buyer?.email}</TableCell>
                    <TableCell className="hidden md:table-cell">${Number(o.totalAmount).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs capitalize">{o.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between p-3 border-t border-border text-sm">
            <span>Page {page} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <button className="btn" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</button>
              <button className="btn" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-border p-12 text-center">No orders found</div>
      )}
    </div>
  );
}

