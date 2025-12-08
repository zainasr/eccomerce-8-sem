"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit2, Trash2, FileText } from "lucide-react";
import type { Blog } from "@/types";
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

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", "10");
    if (filters.search) params.set("search", filters.search);
    if (filters.status) params.set("status", filters.status);
    return params.toString();
  }, [page, filters]);

  useEffect(() => {
    (async function fetchBlogs() {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/admin/blogs?${queryString}`, {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setBlogs(data.data?.blogs || []);
          setTotalPages(data.data?.pagination?.totalPages || 1);
        } else {
          setBlogs([]);
        }
      } catch {
        setBlogs([]);
      }
      setIsLoading(false);
    })();
  }, [queryString]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/admin/blogs/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        toast.success("Blog deleted");
        setBlogs((prev) => prev.filter((b) => b.id !== id));
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to delete blog");
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Blogs</h1>
          <p className="text-text-secondary mt-2 text-sm sm:text-base">Manage blog posts</p>
        </header>
        <Link href="/admin/blogs/new">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Blog
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-border p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search by title or excerpt"
              value={filters.search}
              onChange={(e) => {
                setFilters({ ...filters, search: e.target.value });
                setPage(1);
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              className="input"
              value={filters.status}
              onChange={(e) => {
                setFilters({ ...filters, status: e.target.value });
                setPage(1);
              }}
            >
              <option value="">All</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg border border-border p-8 text-center">Loading...</div>
      ) : blogs.length > 0 ? (
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Published</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs.map((b, idx) => (
                  <TableRow key={b.id}>
                    <TableCell>{(page - 1) * 10 + idx + 1}</TableCell>
                    <TableCell>
                      <div className="font-medium">{b.title}</div>
                      <div className="text-xs text-text-secondary truncate max-w-[240px]">{b.excerpt || "-"}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="text-xs capitalize">{b.status}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-text-secondary">
                      {b.publishedAt ? new Date(b.publishedAt).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <Link href={`/admin/blogs/${b.id}/edit`} className="inline-flex items-center gap-2 text-primary hover:underline">
                          <Edit2 className="h-4 w-4" /> Edit
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-error hover:text-error"
                          onClick={() => setConfirmDeleteId(b.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
          <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-slate-300 mx-auto mb-4" />
          <p className="text-text-secondary text-sm sm:text-base">No blogs found</p>
        </div>
      )}

      <AlertDialog open={Boolean(confirmDeleteId)} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete blog?</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this blog? This action cannot be undone.</AlertDialogDescription>
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
