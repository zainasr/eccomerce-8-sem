import type { Metadata } from "next";
import Link from "next/link";
import { API_URL } from "@/lib/constants";
import type { Blog } from "@/types";

export const metadata: Metadata = {
  title: "Blogs | ShopHub",
  description: "Latest articles and updates from ShopHub.",
};

async function getBlogs(): Promise<Blog[]> {
  try {
    const res = await fetch(`${API_URL}/blogs?page=1&limit=12`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data?.blogs || [];
  } catch {
    return [];
  }
}

export default async function BlogsPage() {
  const blogs = await getBlogs();
  return (
    <div className="container py-10 space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold">Blogs</h1>
        <p className="text-text-secondary">Read updates, guides, and announcements.</p>
      </header>

      {blogs.length === 0 ? (
        <div className="bg-white border border-border rounded-lg p-8 text-center text-text-secondary">
          No blogs available yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((b) => (
            <Link
              href={`/blogs/${b.slug}`}
              key={b.id}
              className="group rounded-lg border border-border bg-white p-4 flex flex-col gap-3 hover:shadow-sm transition"
            >
              {b.coverImage && (
                <div className="overflow-hidden rounded-md aspect-video bg-slate-100">
                  <img
                    src={b.coverImage}
                    alt={b.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition"
                  />
                </div>
              )}
              <div className="flex-1 space-y-2">
                <h2 className="text-lg font-semibold line-clamp-2">{b.title}</h2>
                <p className="text-sm text-text-secondary line-clamp-3">{b.excerpt || ""}</p>
              </div>
              <div className="text-xs text-text-secondary">
                {b.publishedAt ? new Date(b.publishedAt).toLocaleDateString() : "Draft"}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

