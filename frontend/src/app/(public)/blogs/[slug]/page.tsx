import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { API_URL } from "@/lib/constants";
import type { Blog } from "@/types";

type Params = { slug: string };

async function getBlog(slug: string): Promise<Blog | null> {
  try {
    const res = await fetch(`${API_URL}/blogs/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const blog = await getBlog(params.slug);
  if (!blog) return { title: "Blog not found | ShopHub" };
  return {
    title: blog.title,
    description: blog.excerpt || undefined,
  };
}

export default async function BlogDetailPage({ params }: { params: Params }) {
  const blog = await getBlog(params.slug);
  if (!blog) return notFound();

  return (
    <div className="container py-10 max-w-4xl space-y-6">
      <div className="space-y-2">
        <p className="text-xs text-text-secondary">
          {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : ""}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold">{blog.title}</h1>
        {blog.excerpt && <p className="text-text-secondary">{blog.excerpt}</p>}
      </div>

      {blog.coverImage && (
        <div className="overflow-hidden rounded-lg border border-border bg-slate-50">
          <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
        </div>
      )}

      <article
        className="prose prose-neutral max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  );
}

