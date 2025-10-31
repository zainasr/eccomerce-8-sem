import type { Metadata } from 'next';
import type { Product, Category } from '@/types';
import { API_URL } from '@/lib/constants';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'ShopHub | Buy Electronics, Home & Lifestyle Online',
  description: 'ShopHub brings you curated products across electronics, home, and lifestyle. Great prices, trusted checkout, fast delivery.',
  keywords: ['online shopping','buy electronics online','home and lifestyle','best deals','ShopHub'],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'ShopHub | Buy Electronics, Home & Lifestyle Online',
    description: 'Discover curated products at great prices with trusted checkout and fast delivery.',
    images: ['/apple-touch-icon.png'],
  },
};

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/products/get-all-products?limit=8&status=active`, { cache: 'no-store' });
    if (!response.ok) return [];
    const data = await response.json();
    return data.data.products || [];
  } catch (_e) { return []; }
}

async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_URL}/categories/get-all-categories`, { cache: 'no-store' });
    if (!response.ok) return [];
    const data = await response.json();
    return data.data.categories || [];
  } catch (_e) { return []; }
}

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);
  console.log("products",products)
  console.log("categories",categories)
  return <HomeClient products={products} categories={categories} />;
}