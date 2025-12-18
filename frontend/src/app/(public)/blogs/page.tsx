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
    <div className="container py-12 md:py-16 space-y-8">
      <header className="space-y-3 mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold">Blogs</h1>
        <p className="text-lg text-text-secondary">Read updates, guides, and announcements.</p>
      </header>

      {blogs.length === 0 ? (
        <div className="bg-white border border-border/50 rounded-xl p-12 text-center text-text-secondary shadow-sm">
          <p className="text-lg">No blogs available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {blogs.map((b) => (
            <Link
              href={`/blogs/${b.slug}`}
              key={b.id}
              className="group rounded-xl border border-border/50 bg-white p-0 flex flex-col overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              {b.coverImage && (
                <div className="overflow-hidden aspect-video bg-slate-100">
                  <img
                    src={b.coverImage}
                    alt={b.title}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="flex-1 space-y-3 p-5">
                <h2 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors leading-snug">{b.title}</h2>
                <p className="text-sm text-text-secondary line-clamp-3 leading-relaxed">{b.excerpt || ""}</p>
                <div className="text-xs text-text-secondary font-medium pt-2">
                  {b.publishedAt ? new Date(b.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "Draft"}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

