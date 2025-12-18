"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadDropzone } from "@/utils/uploadthing";
import { BlogEditor } from "@/components/blog/BlogEditor";
import { toast } from "sonner";

export default function AdminNewBlogPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingBlog, setIsGeneratingBlog] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    status: "draft" as "draft" | "published",
  });

  const generateBlog = async () => {
    const prompt = window.prompt("What should this blog post be about? Describe the topic, key points, or any specific information you want included.");
    if (prompt === null || !prompt.trim()) return;

    setIsGeneratingBlog(true);
    try {
      const res = await fetch("/api/ai/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!res.ok) throw new Error("AI request failed");
      const data = await res.json();

      if (!data.title || !data.content) {
        throw new Error("Incomplete blog data returned");
      }

      setForm((prev) => ({
        ...prev,
        title: data.title || prev.title,
        excerpt: data.excerpt || prev.excerpt,
        content: data.content || prev.content,
      }));

      toast.success("Blog generated successfully");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Failed to generate blog");
    } finally {
      setIsGeneratingBlog(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) {
      toast.error("Title and content are required");
      return;
    }
    setIsSubmitting(true);
    try {
      const body = {
        title: form.title,
        slug: form.slug || undefined,
        excerpt: form.excerpt || undefined,
        content: form.content,
        coverImage: form.coverImage || undefined,
        status: form.status,
      };

      const res = await fetch(`${API_URL}/admin/blogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to create blog");
      }

      toast.success("Blog created");
      router.push("/admin/blogs");
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Add New Blog</h1>
          <p className="text-text-secondary mt-2 text-sm sm:text-base">Create a new blog post</p>
        </div>
      </header>

      <form onSubmit={onSubmit} className="bg-white rounded-lg border border-border p-4 sm:p-6 space-y-6">
        <div className="flex items-center justify-end mb-4">
          <Button
            type="button"
            variant="outline"
            onClick={generateBlog}
            disabled={isGeneratingBlog}
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            {isGeneratingBlog ? "Generating Blog..." : "Generate with AI"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (optional)</Label>
              <Input
                id="slug"
                placeholder="auto-generated if left blank"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                rows={3}
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Cover Image</Label>
              <UploadDropzone
                endpoint="productImageUploader"
                onClientUploadComplete={(res) => {
                  const url = res?.[0]?.ufsUrl || res?.[0]?.url;
                  if (url) setForm((prev) => ({ ...prev, coverImage: url }));
                  toast.success("Uploaded");
                }}
                onUploadError={(e: unknown) => {
                  const error = e as Error;
                  toast.error(error.message || "Upload error");
                }}
              />
              {form.coverImage && (
                <div className="pt-2">
                  <img src={form.coverImage} alt="cover" className="h-32 w-full object-cover rounded-lg border border-border" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-error"
                    onClick={() => setForm((prev) => ({ ...prev, coverImage: "" }))}
                  >
                    Remove cover
                  </Button>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="input"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "published" })}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 lg:col-span-1">
            <Label>Content *</Label>
            <BlogEditor
              value={form.content}
              onChange={(val) => setForm((prev) => ({ ...prev, content: val }))}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/blogs")}>Cancel</Button>
          <Button type="submit" className="bg-primary hover:bg-primary-hover" disabled={isSubmitting}>
            Create Blog
          </Button>
        </div>
      </form>
    </div>
  );
}

