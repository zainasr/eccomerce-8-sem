import type { Metadata } from 'next';
import ProductsClient from './ProductsClient';
import { API_URL } from '@/lib/constants';
import type { Product, Category } from '@/types';

export const metadata: Metadata = {
  title: 'All Products | ShopHub',
  description: 'Browse all products available at ShopHub. Find great deals and new arrivals.',
  alternates: { canonical: '/products' },
  openGraph: { images: ['/apple-touch-icon.png'] },
};

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/categories/get-all-categories?limit=100`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data?.categories || [];
  } catch {
    return [];
  }
}

async function getProducts(searchParams: { [key: string]: string | undefined }): Promise<{ products: Product[]; totalPages: number; page: number; }> {
  const params = new URLSearchParams();
  if (searchParams.search) params.append('search', searchParams.search);
  if (searchParams.categoryId) params.append('categoryId', searchParams.categoryId);
  if (searchParams.minPrice) params.append('minPrice', searchParams.minPrice);
  if (searchParams.maxPrice) params.append('maxPrice', searchParams.maxPrice);
  if (searchParams.status) params.append('status', searchParams.status);
  if (searchParams.inStock) params.append('inStock', searchParams.inStock);
  params.append('sortBy', searchParams.sortBy || 'createdAt');
  params.append('sortOrder', searchParams.sortOrder || 'desc');
  const page = Number(searchParams.page || '1');
  params.append('page', String(page));
  params.append('limit', '12');

  try {
    const res = await fetch(`${API_URL}/products/get-all-products?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) return { products: [], totalPages: 1, page };
    const data = await res.json();
    return {
      products: data.data?.products || [],
      totalPages: data.data?.pagination?.totalPages || 1,
      page,
    };
  } catch {
    return { products: [], totalPages: 1, page };
  }
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const sp = await searchParams;
  const [categories, productsRes] = await Promise.all([
    getCategories(),
    getProducts(sp || {}),
  ]);
  console.log("productsRes",productsRes)  
  console.log("categories",categories)

  const initialFilters = {
    search: sp?.search || '',
    categoryIds: sp?.categoryId ? sp.categoryId.split(',').filter(Boolean) : [],
    minPrice: sp?.minPrice || '',
    maxPrice: sp?.maxPrice || '',
    status: sp?.status || '',
    inStock: sp?.inStock || '',
    sortBy: sp?.sortBy || 'createdAt',
    sortOrder: sp?.sortOrder || 'desc',
  };

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: productsRes.products.map((p, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/products/${p.slug}`,
      name: p.name,
    })),
  };

  return (
    <div className="container">
      <header className="py-6 md:py-8">
        <h1 className="text-3xl md:text-4xl font-bold">All Products</h1>
        <p className="text-text-secondary mt-2">Explore our full catalog of items</p>
      </header>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <ProductsClient
        categories={categories}
        initialProducts={productsRes.products}
        initialTotalPages={productsRes.totalPages}
        initialPage={productsRes.page}
        initialFilters={initialFilters}
      />
    </div>
  );
}