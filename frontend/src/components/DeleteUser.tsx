'use client';
import { useState } from "react";
import { API_URL } from "@/lib/constants";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function QuickDeleteUser() {
    'use client';
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
  
    const onDelete = async () => {
      setError(null); setSuccess(null);
      if (!userId) { setError('Enter a user ID'); return; }
      if (!confirm('Delete this user? This cannot be undone.')) return;
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/admin/users/${userId}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (!res.ok) {
          const e = await res.json().catch(()=>({message:'Failed'}));
          throw new Error(e.message || 'Failed to delete');
        }
        setSuccess('User deleted');
        setUserId('');
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to delete user');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className={cn("bg-white rounded-lg border border-border p-4 sm:p-6 flex flex-col gap-3")}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Quick Actions</h3>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          <Input placeholder="User ID" value={userId} onChange={(e)=>setUserId(e.target.value)} />
          <Button onClick={onDelete} disabled={loading} className="flex items-center gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} Delete User
          </Button>
        </div>
        {error && <p className="text-xs text-error">{error}</p>}
        {success && <p className="text-xs text-success">{success}</p>}
      </div>
    );
  }