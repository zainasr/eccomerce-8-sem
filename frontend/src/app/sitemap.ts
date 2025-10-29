import type { MetadataRoute } from 'next';
import { API_URL } from '@/lib/constants';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/products`, changeFrequency: 'daily', priority: 0.9 },
  ];

  try {
    // Categories
    const catRes = await fetch(`${API_URL}/categories/get-all-categories?limit=1000`, { cache: 'no-store' });
    if (catRes.ok) {
      const catData = await catRes.json();
      const categories: { slug: string; updatedAt?: string }[] = catData.data?.categories || [];
      for (const c of categories) {
        urls.push({
          url: `${SITE_URL}/category/${c.slug}`,
          changeFrequency: 'weekly',
          priority: 0.6,
          lastModified: c.updatedAt ? new Date(c.updatedAt) : undefined,
        });
      }
    }
  } catch {}

  try {
    // Products (paginate to be safe)
    let page = 1;
    const limit = 100;
    // Try first page to determine total
    const firstRes = await fetch(`${API_URL}/products/get-all-products?page=${page}&limit=${limit}&status=active`, { cache: 'no-store' });
    if (firstRes.ok) {
      const first = await firstRes.json();
      const totalPages = first.data?.pagination?.totalPages || 1;
      const addProducts = (items: any[]) => {
        for (const p of items || []) {
          urls.push({
            url: `${SITE_URL}/products/${p.slug}`,
            changeFrequency: 'daily',
            priority: 0.8,
            lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
          });
        }
      };
      addProducts(first.data?.products || []);

      const fetches: Promise<Response>[] = [];
      for (let i = 2; i <= totalPages; i++) {
        fetches.push(fetch(`${API_URL}/products/get-all-products?page=${i}&limit=${limit}&status=active`, { cache: 'no-store' }));
      }
      if (fetches.length) {
        const results = await Promise.all(fetches);
        for (const res of results) {
          if (res.ok) {
            const data = await res.json();
            addProducts(data.data?.products || []);
          }
        }
      }
    }
  } catch {}

  return urls;
}
