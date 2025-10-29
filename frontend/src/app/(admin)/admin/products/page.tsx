"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Package, Edit2, Trash2 } from "lucide-react";
import type { Category, Product } from "@/types";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    categoryIds: [] as string[],
    status: "",
    inStock: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    (async function loadCategories() {
      try {
        const res = await fetch(`${API_URL}/categories/get-all-categories?limit=100`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setCategories(data.data?.categories || []);
        }
      } catch {}
    })();
  }, []);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", "10");
    if (filters.search) params.set("search", filters.search);
    if (filters.categoryIds.length > 0) params.set("categoryId", filters.categoryIds.join(","));
    if (filters.status) params.set("status", filters.status);
    if (filters.inStock) params.set("inStock", filters.inStock);
    params.set("sortBy", filters.sortBy);
    params.set("sortOrder", filters.sortOrder);
    return params.toString();
  }, [page, filters]);

  useEffect(
    () => {
    
      (async function loadProducts() {
        setIsLoading(true);
        try {
          const res = await fetch(`${API_URL}/products/get-all-products?${queryString}`, { credentials: "include" });
          if (res.ok) {
            const data = await res.json();
            setProducts(data.data?.products || []);
            setTotalPages(data.data?.pagination?.totalPages || 1);
          }
        } catch (error) {
          console.error('Failed to fetch products:', error);
        }
        setIsLoading(false);
        
      })();
    }, [queryString]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        toast.success("Product deleted");
        // Refresh list
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.message || "Failed to delete product");
      }
    } catch (_e) {
      toast.error("Error deleting product");
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const changeCategory = (id: string) => {
    setFilters((prev) => ({ ...prev, categoryIds: id ? [id] : [] }));
    setPage(1);
  };

  return (
    <div className="space-y-4 md:space-y-6 px-4 sm:px-6 lg:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <header>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Products Management</h1>
          <p className="text-text-secondary mt-2 text-sm sm:text-base">Manage all products in your store</p>
        </header>
        <Link href="/admin/products/new">
          <Button className="bg-primary hover:bg-primary-hover w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-border p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="search">Search</Label>
            <Input id="search" placeholder="Search by name or SKU" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select id="category" className="input" value={filters.categoryIds[0] || ""} onChange={(e) => changeCategory(e.target.value)}>
              <option value="">All</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select id="status" className="input" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <option value="">All</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock">Stock</Label>
            <select id="stock" className="input" value={filters.inStock} onChange={(e) => setFilters({ ...filters, inStock: e.target.value })}>
              <option value="">All</option>
              <option value="true">In Stock</option>
              <option value="false">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="bg-white rounded-lg border border-border p-8 text-center">Loading...</div>
      ) : products.length > 0 ? (
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Price</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p, idx) => (
                  <TableRow key={p.id}>
                    <TableCell>{(page - 1) * 10 + idx + 1}</TableCell>
                    <TableCell>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-text-secondary">{p.sku || "No SKU"}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">${Number(p.price).toFixed(2)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="text-xs">{p.status}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{p.stockQuantity}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <Link href={`/admin/products/${p.id}/edit`} className="inline-flex items-center gap-2 text-primary hover:underline">
                          <Edit2 className="h-4 w-4" /> Edit
                        </Link>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-error hover:text-error" onClick={() => setConfirmDeleteId(p.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between p-3 border-t border-border text-sm">
            <span>Page {page} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
              <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-border p-12 text-center">
          <Package className="h-12 w-12 sm:h-16 sm:w-16 text-slate-300 mx-auto mb-4" />
          <p className="text-text-secondary text-sm sm:text-base">No products found</p>
        </div>
      )}

      {/* Delete confirmation */}
      <AlertDialog open={Boolean(confirmDeleteId)} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-error hover:opacity-90" onClick={() => confirmDeleteId && handleDelete(confirmDeleteId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

