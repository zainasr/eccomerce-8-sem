"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { UploadDropzone } from "@/utils/uploadthing";
import type { Category } from "@/types";
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

export default function AdminNewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isGeneratingSeo, setIsGeneratingSeo] = useState(false);
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
    (async function loadCategories() {
      try {
        const res = await fetch(`${API_URL}/categories/get-all-categories?limit=100`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setCategories(data.data?.categories || []);
        }
      } catch (e: unknown) {
        const error = e as Error;
        toast.error(error.message || "Failed to load categories");
      }
    })();
  }, []);

  const removeImage = async (url: string) => {
    // optimistically remove from UI
    setForm((prev) => ({ ...prev, images: prev.images.filter((u) => u !== url) }));
    try {
      await fetch('/api/uploadthing/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
    } catch {
      // ignore network error; UI already updated
    }
  };

  const addCategory = (id: string) => {
    if (!id) return;
    setForm((prev) =>
      prev.categoryIds.includes(id)
        ? prev
        : { ...prev, categoryIds: [...prev.categoryIds, id] }
    );
  };

  const removeCategory = (id: string) => {
    setForm((prev) => ({ ...prev, categoryIds: prev.categoryIds.filter((x) => x !== id) }));
  };

  const generateDescription = async () => {
    if (!form.description || form.description.trim().length === 0) {
      toast.error("Type a few characters first to enable AI assist");
      return;
    }
    const extra = window.prompt("What is the product about? Add details to guide the AI.");
    if (extra === null) return;
    setIsGeneratingDescription(true);
    try {
      const res = await fetch("/api/ai/describe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: extra,
          productName: form.name,
          categories: form.categoryIds
            .map((id) => categories.find((c) => c.id === id)?.name)
            .filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error("AI request failed");
      const data = await res.json();
      if (!data.description) throw new Error("No description returned");
      setForm((prev) => ({ ...prev, description: data.description }));
      toast.success("Description generated");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate description");
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const generateSeo = async () => {
    setIsGeneratingSeo(true);
    try {
      const res = await fetch("/api/ai/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: form.name,
          description: form.description,
          categories: form.categoryIds
            .map((id) => categories.find((c) => c.id === id)?.name)
            .filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error("AI request failed");
      const data = await res.json();
      setForm((prev) => ({
        ...prev,
        seoTitle: data.title || prev.seoTitle,
        seoDescription: data.seoDescription || prev.seoDescription,
        seoKeywords: data.seoKeywords || prev.seoKeywords,
      }));
      toast.success("SEO generated");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate SEO");
    } finally {
      setIsGeneratingSeo(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.categoryIds.length === 0) {
      toast.error("Select at least one category");
      return;
    }
    if (!form.name || !form.description || !form.price) {
      toast.error("Name, description and price are required");
      return;
    }

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

      const res = await fetch(`${API_URL}/products/create-product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create product");
      }

      toast.success("Product created");
      router.push("/admin/products");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 px-4 sm:px-6 lg:px-0">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Add New Product</h1>
          <p className="text-text-secondary mt-2 text-sm sm:text-base">Create a new product and upload images</p>
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
              {form.description.trim().length > 0 && (
                <div className="flex justify-end">
                  <Button type="button" variant="outline" size="sm" onClick={generateDescription} disabled={isGeneratingDescription}>
                    {isGeneratingDescription ? "Generating..." : "Write with AI"}
                  </Button>
                </div>
              )}
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
              <div className="flex flex-col gap-2">
                <select
                  className="input"
                  onChange={(e) => addCategory(e.target.value)}
                  value=""
                >
                  <option value="" disabled>Select category...</option>
                  {categories
                    .slice()
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
                {form.categoryIds.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.categoryIds.map((id) => {
                      const cat = categories.find((c) => c.id === id);
                      if (!cat) return null;
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center gap-2 rounded-full bg-primary-light text-primary px-3 py-1 text-xs"
                        >
                          {cat.name}
                          <button
                            type="button"
                            aria-label={`Remove ${cat.name}`}
                            onClick={() => removeCategory(id)}
                            className="text-primary-hover"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Images</Label>
              <UploadDropzone
                endpoint="productImageUploader"
                onClientUploadComplete={(res) => {
                  const urls = res?.map((f: { ufsUrl: string; url: string }) => f.ufsUrl || f.url).filter(Boolean) as string[];
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
                  {form.images.map((u) => (
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
              <div className="flex items-center justify-between">
                <Label>SEO</Label>
                <Button type="button" variant="outline" size="sm" onClick={generateSeo} disabled={isGeneratingSeo}>
                  {isGeneratingSeo ? "Generating..." : "Write with AI"}
                </Button>
              </div>
              <Input placeholder="SEO Title" value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} />
              <Input placeholder="SEO Keywords (comma-separated)" value={form.seoKeywords} onChange={(e) => setForm({ ...form, seoKeywords: e.target.value })} />
              <Textarea placeholder="SEO Description" value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} rows={3} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>Cancel</Button>
          <Button type="submit" className="bg-primary hover:bg-primary-hover" disabled={isSubmitting}>
            Create Product
          </Button>
        </div>
      </form>
    </div>
  );
}
