"use client";
import { useEffect, useMemo, useState } from "react";
import { API_URL } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {  Users} from "lucide-react";
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
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import type { User, UserRole, UserStatus } from "@/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<{ search: string; role: "" | UserRole; status: "" | UserStatus }>({ search: "", role: "", status: "" });
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    p.set("page", String(page));
    p.set("limit", "10");
    if (filters.search) p.set("search", filters.search);
    if (filters.role) p.set("role", filters.role);
    if (filters.status) p.set("status", filters.status);
    return p.toString();
  }, [page, filters]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/admin/users?${queryString}`, { credentials: "include", cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setUsers(data.data?.users || []);
          setTotalPages(data.data?.pagination?.totalPages || 1);
        } else {
          setUsers([]);
          setTotalPages(1);
        }
      } catch {
        setUsers([]);
        setTotalPages(1);
      }
      setIsLoading(false);
    })();
  }, [queryString]);

  const promote = async (userId: string) => {
    try {
      const res = await fetch(`${API_URL}/admin/users/promote`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        toast.success("User promoted to admin");
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: "admin" } : u)));
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to promote user");
      }
    } catch {}
  };

  const updateStatus = async (userId: string, status: UserStatus) => {
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success("User status updated");
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status } : u)));
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to update user status");
      }
    } catch {}
  };

  const removeUser = async (userId: string) => {
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}`, { method: "DELETE", credentials: "include" });
      if (res.ok) {
        toast.success("User deleted");
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to delete user");
      }
    } catch {}
    setConfirmDeleteId(null);
  };

  return (
    <div className="space-y-4 md:space-y-6 px-4 sm:px-6 lg:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <header>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">User Management</h1>
          <p className="text-text-secondary mt-2 text-sm sm:text-base">Manage all users in your platform</p>
        </header>
      </div>
      {/* Filters */}
      <div className="bg-white rounded-lg border border-border p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="search">Search</Label>
            <Input id="search" placeholder="Name or email" value={filters.search} onChange={(e) => { setFilters({ ...filters, search: e.target.value }); setPage(1); }} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <select id="role" className="input" value={filters.role} onChange={(e) => { setFilters({ ...filters, role: e.target.value as UserRole | "" }); setPage(1); }}>
              <option value="">All</option>
              <option value="buyer">Buyer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select id="status" className="input" value={filters.status} onChange={(e) => { setFilters({ ...filters, status: e.target.value as UserStatus | "" }); setPage(1); }}>
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>
      {/* Table Desktop */}
      {isLoading ? (
        <div className="bg-white rounded-lg border border-border p-8 text-center">Loading...</div>
      ) : users.length > 0 ? (
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              
                <TableBody>
                {users.map((u, idx) => (
                  <TableRow key={u.id}>
                    <TableCell>{(page - 1) * 10 + idx + 1}</TableCell>
                    <TableCell>
                      <div className="font-medium">{u.email}</div>
                      <div className="text-xs text-text-secondary">{u.role || "No email"}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">${(u.email)}
                      <div className="text-xs text-text-secondary">{u.role || "No Role"}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="text-xs">{u.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        {u.role !== 'admin' && (
                          <Button size="sm" variant="outline" onClick={() => promote(u.id)}>Promote</Button>
                        )}
                        {u.status !== 'active' && (
                          <Button size="sm" variant="outline" onClick={() => updateStatus(u.id, 'active')}>Activate</Button>
                        )}
                        {u.status !== 'suspended' && (
                          <Button size="sm" variant="outline" onClick={() => updateStatus(u.id, 'suspended')}>Suspend</Button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">Delete</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete user?</AlertDialogTitle>
                              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => removeUser(u.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
          <Users className="h-12 w-12 sm:h-16 sm:w-16 text-slate-300 mx-auto mb-4" />
          <p className="text-text-secondary text-sm sm:text-base">No users found</p>
        </div>
      )}
      {/* Mobile cards */}
      
    </div>
  );
}

