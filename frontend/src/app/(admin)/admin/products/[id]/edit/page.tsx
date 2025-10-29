"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_URL } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { UploadDropzone } from "@/utils/uploadthing";
import type { Category, Product } from "@/types";
import { toast } from "sonner";

interface FormState {
  name: string;
  description: string;
  price: string;
  sku: string;
  status: "draft" | "active" | "inactive";
  stockQuantity: string;
  lowStockThreshold: string;
  allowBackorder: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  categoryIds: string[];
  images: string[];
}

export default function AdminEditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    price: "",
    sku: "",
    status: "draft",
    stockQuantity: "0",
    lowStockThreshold: "5",
    allowBackorder: false,
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    categoryIds: [],
    images: [],
  });

  useEffect(() => {
    (async function init() {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch(`${API_URL}/categories/get-all-categories?limit=100`, { credentials: "include" }),
          fetch(`${API_URL}/products/get-product-by-id/${id}`, { credentials: "include" }),
        ]);
        if (catRes.ok) {
          const d = await catRes.json();
          setCategories(d.data?.categories || []);
        }
        if (prodRes.ok) {
          const d = await prodRes.json();
          const p: Product = d.data;
          setForm({
            name: p.name,
            description: p.description || "",
            price: String(p.price),
            sku: p.sku || "",
            status: (p.status as "draft" | "active" | "inactive") || "draft",
            stockQuantity: String(p.stockQuantity ?? 0),
            lowStockThreshold: String(p.lowStockThreshold ?? 5),
            allowBackorder: Boolean(p.allowBackorder),
            seoTitle: p.seoTitle || "",
            seoDescription: p.seoDescription || "",
            seoKeywords: p.seoKeywords || "",
            categoryIds: (p.categories || []).map((c) => c.id),
            images: (p.images || []).map((i) => i.imageUrl),
          });
        }
      } catch {}
      setLoading(false);
    })();
  }, [id]);

  const toggleCategory = (cid: string) => {
    setForm((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(cid)
        ? prev.categoryIds.filter((x) => x !== cid)
        : [...prev.categoryIds, cid],
    }));
  };

  const removeImage = async (url: string) => {
    // optimistic update
    setForm((prev) => ({ ...prev, images: prev.images.filter((u) => u !== url) }));
    try {
      await fetch('/api/uploadthing/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
    } catch {
      // ignore
    }
  };

  const removeCategory = (id: string) => {
    setForm((prev) => ({ ...prev, categoryIds: prev.categoryIds.filter((x) => x !== id) }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const body = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        sku: form.sku || undefined,
        status: form.status,
        stockQuantity: Number(form.stockQuantity),
        lowStockThreshold: Number(form.lowStockThreshold),
        allowBackorder: form.allowBackorder,
        seoTitle: form.seoTitle || undefined,
        seoDescription: form.seoDescription || undefined,
        seoKeywords: form.seoKeywords || undefined,
        images: form.images,
        categoryIds: form.categoryIds,
      };

      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update product");
      }
      toast.success("Product updated");
      router.push("/admin/products");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="px-4 sm:px-6 lg:px-0">Loading...</div>;

  return (
    <div className="space-y-4 md:space-y-6 px-4 sm:px-6 lg:px-0">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Edit Product</h1>
          <p className="text-text-secondary mt-2 text-sm sm:text-base">Update product information</p>
        </div>
      </header>

      <form onSubmit={onSubmit} className="bg-white rounded-lg border border-border p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={5} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input id="price" type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="stockQuantity">Stock Qty</Label>
                <Input id="stockQuantity" type="number" min="0" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                <Input id="lowStockThreshold" type="number" min="0" value={form.lowStockThreshold} onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="allowBackorder" checked={form.allowBackorder} onCheckedChange={(v) => setForm({ ...form, allowBackorder: Boolean(v) })} />
              <Label htmlFor="allowBackorder">Allow backorder</Label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Categories *</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {categories.map((c) => (
                  <label key={c.id} className="flex items-center gap-2 rounded-lg border border-border p-2">
                    <Checkbox checked={form.categoryIds.includes(c.id)} onCheckedChange={() => toggleCategory(c.id)} />
                    <span className="text-sm">{c.name}</span>
                  </label>
                ))}
              </div>
            {form.categoryIds.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {form.categoryIds.map((id) => {
                  const cat = categories.find((c) => c.id === id);
                  if (!cat) return null;
                  return (
                    <span key={id} className="inline-flex items-center gap-2 rounded-full bg-primary-light text-primary px-3 py-1 text-xs">
                      {cat.name}
                      <button type="button" aria-label={`Remove ${cat.name}`} onClick={() => removeCategory(id)} className="text-primary-hover">×</button>
                    </span>
                  );
                })}
              </div>
            )}
            </div>

            <div className="space-y-2">
              <Label>Images</Label>
              <UploadDropzone
                endpoint="productImageUploader"
                onClientUploadComplete={(res: Array<{ ufsUrl?: string; url?: string }>) => {
                  const urls = res?.map((f) => f.ufsUrl || f.url).filter(Boolean) as string[];
                  if (urls?.length) setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
                  toast.success("Uploaded");
                }}
                onUploadError={(e: unknown) => {
                  const error = e as Error;
                  toast.error(error.message || "Upload error");
                }}
              />
              {form.images.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {form.images.map((u: string) => (
                    <div key={u} className="relative group">
                      <img src={u} alt="product" className="h-20 w-20 object-cover rounded-md border border-border" />
                      <button type="button" onClick={() => removeImage(u)} className="absolute -top-2 -right-2 bg-error text-white rounded-full h-6 w-6 text-xs">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select id="status" className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "active" | "inactive" })}>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>SEO</Label>
              <Input placeholder="SEO Title" value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} />
              <Input placeholder="SEO Keywords (comma-separated)" value={form.seoKeywords} onChange={(e) => setForm({ ...form, seoKeywords: e.target.value })} />
              <Textarea placeholder="SEO Description" value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} rows={3} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>Cancel</Button>
          <Button type="submit" className="bg-primary hover:bg-primary-hover" disabled={isSubmitting}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
