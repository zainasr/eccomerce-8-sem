import type { Metadata } from 'next';
import { API_URL } from '@/lib/constants';
import type { Category, Product } from '@/types';
import ProductsClient from '@/app/(public)/products/ProductsClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

async function getAllCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/categories/get-all-categories?limit=100`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data?.categories || [];
  } catch {
    return [];
  }
}

async function getProductsByCategory(categoryId: string): Promise<{ products: Product[]; totalPages: number }> {
  try {
    const res = await fetch(`${API_URL}/products/get-all-products?limit=12&page=1&status=active&categoryId=${categoryId}`, { cache: 'no-store' });
    if (!res.ok) return { products: [], totalPages: 1 };
    const data = await res.json();
    return {
      products: data.data?.products || [],
      totalPages: data.data?.pagination?.totalPages || 1,
    };
  } catch {
    return { products: [], totalPages: 1 };
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getAllCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) {
    return { title: 'Category Not Found' };
  }
  const canonical = `${SITE_URL}/category/${category.slug}`;
  return {
    title: `${category.name} | ShopHub`,
    description: `Explore ${category.name} products at ShopHub. Fast shipping, secure checkout.`,
    openGraph: {
      title: `${category.name} | ShopHub`,
      description: `Browse ${category.name} products`,
      type: 'website',
      url: canonical,
    },
    alternates: { canonical },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categories = await getAllCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) {
    return (
      <main className="container py-10">
        <h1 className="text-2xl font-bold">Category Not Found</h1>
        <p className="text-text-secondary mt-2">We couldn&apos;t find this category.</p>
      </main>
    );
  }

  const { products, totalPages } = await getProductsByCategory(category.id);

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((p, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/products/${p.slug}`,
      name: p.name,
    })),
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="container py-6 md:py-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
        <header className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">{category.name}</h1>
          <p className="text-text-secondary">Browse products in {category.name}</p>
          <p className="text-sm text-text-secondary mt-2 max-w-3xl">Find the latest and best {category.name.toLowerCase()} with fast delivery and secure checkout at ShopHub.</p>
        </header>
        <ProductsClient
          categories={categories}
          initialProducts={products}
          initialTotalPages={totalPages}
          initialPage={1}
          initialFilters={{ categoryIds: [category.id], sortBy: 'createdAt', sortOrder: 'desc' }}
        />
      </div>
    </main>
  );
}
