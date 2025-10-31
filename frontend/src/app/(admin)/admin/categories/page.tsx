"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit2, Trash2, Tags } from "lucide-react";
import type { Category } from "@/types";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ search: "" });
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", "10");
    if (filters.search) params.set("search", filters.search);
    return params.toString();
  }, [page, filters]);

  useEffect(() => {
    (async function fetchCategories() {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/categories/get-all-categories?${queryString}`, {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setCategories(data.data?.categories || []);
          setTotalPages(data.data?.pagination?.totalPages || 1);
        } else {
          setCategories([]);
        }
      } catch {
        setCategories([]);
      }
      setIsLoading(false);
    })();
  }, [queryString]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/categories/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        toast.success("Category deleted");
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to delete category");
      }
    } catch {
      toast.error("Error occurred");
    } finally {
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 px-4 sm:px-6 lg:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <header>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Category Management</h1>
          <p className="text-text-secondary mt-2 text-sm sm:text-base">Manage product categories</p>
        </header>
        <Link href="/admin/categories/new">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </Link>
      </div>
      {/* Filters */}
      <div className="bg-white rounded-lg border border-border p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="search">Search</Label>
            <Input id="search" placeholder="Search by name or slug" value={filters.search} onChange={(e) => { setFilters({ ...filters, search: e.target.value }); setPage(1); }} />
          </div>
        </div>
      </div>
      {/* Table Desktop */}
      {isLoading ? (
        <div className="bg-white rounded-lg border border-border p-8 text-center">Loading...</div>
      ) : categories.length > 0 ? (
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.slug}</TableCell>
                    <TableCell>{c.description || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <Link href={`/admin/categories/${c.id}/edit`} className="inline-flex items-center gap-2 text-primary hover:underline">
                          <Edit2 className="h-4 w-4" /> Edit
                        </Link>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-error hover:text-error" onClick={() => setConfirmDeleteId(c.id)}>
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
          <Tags className="h-12 w-12 sm:h-16 sm:w-16 text-slate-300 mx-auto mb-4" />
          <p className="text-text-secondary text-sm sm:text-base">No categories found</p>
        </div>
      )}
      {/* Mobile cards */}
      <div className="grid gap-3 md:hidden">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <div key={i} className="rounded-lg border border-border bg-white p-4">Loading...</div>)
        ) : categories.length > 0 ? (
          categories.map((c) => (
            <div key={c.id} className="rounded-lg border border-border bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{c.name}</p>
                  <Badge variant="outline" className="text-xs mt-1">{c.slug}</Badge>
                </div>
                <div className="flex gap-1">
                  <Link href={`/admin/categories/${c.id}/edit`} className="inline-flex items-center gap-1 text-primary hover:underline">
                    <Edit2 className="h-4 w-4" />
                  </Link>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-error hover:text-error" onClick={() => setConfirmDeleteId(c.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {c.description && (<p className="text-sm text-text-secondary mt-2">{c.description}</p>)}
            </div>
          ))
        ) : (null)}
      </div>
      {/* Delete confirmation */}
      <AlertDialog open={Boolean(confirmDeleteId)} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this category? This action cannot be undone.</AlertDialogDescription>
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

