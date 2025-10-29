import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, ShoppingBag, Package, ShieldCheck, Truck, Headphones } from 'lucide-react';
import { ROUTES, API_URL } from '@/lib/constants';
import { Product, Category } from '@/types';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { Metadata } from 'next';
import { Suspense } from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'ShopHub - Your Modern Online Store | Quality Products at Great Prices',
  description: 'Discover a wide range of quality products at ShopHub. Fast shipping, secure checkout, and excellent customer service. Shop now!',
  keywords: 'online shopping, buy products online, e-commerce store, best deals',
  openGraph: {
    title: 'ShopHub - Your Modern Online Store',
    description: 'Discover quality products at great prices',
    type: 'website',
    url: SITE_URL,
  },
  alternates: { canonical: SITE_URL },
};

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/products/get-all-products?limit=8&status=active`, {
      cache: 'no-store',
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.data.products || [];
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_URL}/categories/get-all-categories`, {
      // next: { revalidate: 3600 },
      cache: 'no-store',
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.data.categories || [];
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

function CategoriesSkeleton() {
  return (
    <section className="bg-surface">
      <div className="container">
        <div className="text-center mb-12">
          <div className="h-8 w-48 mx-auto rounded bg-slate-200 animate-pulse mb-3" />
          <div className="h-4 w-72 mx-auto rounded bg-slate-200 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-white p-6 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-slate-200 mx-auto mb-3" />
              <div className="h-4 w-20 bg-slate-200 rounded mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductsSkeleton() {
  return (
    <section>
      <div className="container">
        <div className="flex justify-between items-center mb-12">
          <div>
            <div className="h-8 w-56 rounded bg-slate-200 animate-pulse mb-2" />
            <div className="h-4 w-72 rounded bg-slate-200 animate-pulse" />
          </div>
          <div className="h-9 w-28 rounded bg-slate-200 animate-pulse hidden md:block" />
        </div>
        <div className="product-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card h-full animate-pulse">
              <div className="aspect-square bg-slate-200 rounded-t-xl" />
              <div className="p-4 space-y-3">
                <div className="h-5 w-3/4 bg-slate-200 rounded" />
                <div className="h-8 w-24 bg-slate-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

async function CategoriesSection() {
  const categories = await getCategories();
  if (categories.length === 0) return null;
  return (
    <section className="bg-surface">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Shop by Category</h2>
          <p className="text-text-secondary">Browse our wide selection of products</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={ROUTES.CATEGORY(category.slug)}
              className="group"
            >
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1 duration-200">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-primary-light rounded-full flex items-center justify-center group-hover:bg-primary transition-colors">
                    <ShoppingBag className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

async function FeaturedProductsSection() {
  const products = await getFeaturedProducts();
  return (
    <section>
      <div className="container">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Products</h2>
            <p className="text-text-secondary">Check out our handpicked selection</p>
          </div>
          <Link href={ROUTES.PRODUCTS}>
            <Button variant="outline" className="hidden md:flex">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="product-grid">
            {products.map((product) => (
              <Link key={product.id} href={ROUTES.PRODUCT_DETAIL(product.slug)} className="group">
                <article className="card h-full hover:-translate-y-1 transition-all duration-200">
                  <div className="aspect-square relative bg-surface rounded-t-xl overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0].imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-slate-100">
                        <Package className="h-16 w-16 text-slate-300" />
                      </div>
                    )}
                    {product.stockQuantity < 10 && product.stockQuantity > 0 && (
                      <div className="absolute top-3 right-3">
                        <span className="badge badge-warning">Only {product.stockQuantity} left</span>
                      </div>
                    )}
                    {product.stockQuantity === 0 && (
                      <div className="absolute top-3 right-3">
                        <span className="badge badge-error">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-3xl font-bold text-primary">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-text-secondary text-lg">No products available yet</p>
          </div>
        )}
        <div className="text-center mt-12 md:hidden">
          <Link href={ROUTES.PRODUCTS}>
            <Button size="lg">
              View All Products <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-sky-50 py-16 md:py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Welcome to ShopHub
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto">
              Discover amazing products at unbeatable prices. Fast shipping, secure checkout, and 24/7 customer support.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Link href={ROUTES.PRODUCTS}>
                <Button size="lg" className="bg-primary hover:bg-primary-hover text-lg px-8 py-6">
                  Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* USP Strip */}
      <section className="bg-white border-y border-border">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
            <div className="flex items-center gap-3">
              <Truck className="h-6 w-6 text-primary" />
              <div>
                <p className="font-semibold">Fast & Free Shipping</p>
                <p className="text-sm text-text-secondary">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <div>
                <p className="font-semibold">Secure Payments</p>
                <p className="text-sm text-text-secondary">100% PCI-DSS compliant</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Headphones className="h-6 w-6 text-primary" />
              <div>
                <p className="font-semibold">24/7 Support</p>
                <p className="text-sm text-text-secondary">We’re here to help</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <Suspense fallback={<CategoriesSkeleton />}>
        <CategoriesSection />
      </Suspense>

      {/* Promo Banner */}
      <section className="py-10 md:py-14">
        <div className="container">
          <div className="rounded-2xl bg-gradient-to-r from-primary to-accent p-10 md:p-14 text-white text-center">
            <h3 className="text-2xl md:text-3xl font-bold">Limited Time Offer</h3>
            <p className="opacity-90 mt-2">Save up to 30% on selected items</p>
            <Link href={ROUTES.PRODUCTS}>
              <Button size="lg" variant="secondary" className="mt-5">Shop Deals</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <Suspense fallback={<ProductsSkeleton />}>
        <FeaturedProductsSection />
      </Suspense>

      {/* Newsletter */}
      <section className="py-14 md:py-20 bg-surface">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold">Stay in the loop</h3>
            <p className="text-text-secondary mt-2">Get updates on new arrivals and exclusive offers.</p>
            <form action="#" className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input type="email" placeholder="Enter your email" className="input sm:col-span-2" aria-label="Email" />
              <Button type="submit" className="bg-primary hover:bg-primary-hover">Subscribe</Button>
            </form>
            <p className="text-xs text-text-secondary mt-2">By subscribing, you agree to our Privacy Policy.</p>
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-10">
        <div className="container">
          <div className="prose max-w-none text-text-secondary">
            <h2 className="text-xl font-semibold mb-3">Why Shop at ShopHub?</h2>
            <p>
              We curate the best products across categories and deliver them fast. Enjoy secure checkout, easy returns,
              and dedicated support. Our catalog is constantly updated to bring you the latest and greatest.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}