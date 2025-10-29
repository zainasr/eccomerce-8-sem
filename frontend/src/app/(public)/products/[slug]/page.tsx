import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Package, Star, Shield, Truck } from 'lucide-react';
import { API_URL } from '@/lib/constants';
import { Product } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { AddToCartButton } from '@/components/products/AddToCartButton';
import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_URL}/products/get-product-by-slug/${slug}`, {
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const p = await params;
  const product = await getProduct(p.slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const canonical = `${SITE_URL}/products/${product.slug}`;

  return {
    title: product.seoTitle || `${product.name} | ShopHub`,
    description: product.seoDescription || product.description || `Buy ${product.name} at great prices`,
    keywords: product.seoKeywords || product.name,
    openGraph: {
      title: product.name,
      description: product.description || '',
      images: product.images?.length ? [product.images[0].imageUrl] : [],
      url: canonical,
      type: 'website',
    },
    alternates: { canonical },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = await params;
  const product = await getProduct(p.slug);

  if (!product) {
    notFound();
  }

  const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
  const inStock = product.stockQuantity > 0;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images?.map((i) => i.imageUrl) || [],
    description: product.description || undefined,
    sku: product.sku || undefined,
    brand: { '@type': 'Brand', name: 'ShopHub' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: String(product.price),
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${SITE_URL}/products/${product.slug}`,
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      ...(product.categories && product.categories[0]
        ? [{ '@type': 'ListItem', position: 2, name: product.categories[0].name, item: `${SITE_URL}/category/${product.categories[0].slug}` }]
        : []),
      { '@type': 'ListItem', position: 3, name: product.name, item: `${SITE_URL}/products/${product.slug}` },
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="container py-8 md:py-12">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-text-secondary" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li>Home</li>
            <li>/</li>
            {product.categories?.length > 0 && (
              <>
                <li>{product.categories[0].name}</li>
                <li>/</li>
              </>
            )}
            <li className="text-text font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <section className="space-y-4">
            <div className="aspect-square relative bg-surface rounded-2xl overflow-hidden border border-border">
              {primaryImage ? (
                <Image
                  src={primaryImage.imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Package className="h-24 w-24 text-slate-300" />
                </div>
              )}
              {!inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-error text-white px-6 py-3 rounded-lg font-semibold text-lg">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image) => (
                  <div
                    key={image.id}
                    className="aspect-square relative bg-surface rounded-lg overflow-hidden border border-border hover:border-primary transition-colors cursor-pointer"
                  >
                    <Image
                      src={image.imageUrl}
                      alt={product.name}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Product Info */}
          <section className="space-y-6">
            <header>
              <h1 className="text-3xl md:text-4xl font-bold text-text mb-3">
                {product.name}
              </h1>
              {product.categories && product.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.categories.map((category) => (
                    <Badge key={category.id} className="badge-primary">
                      {category.name}
                    </Badge>
                  ))}
                </div>
              )}
            </header>

            <div className="border-t border-b border-border py-6">
              <div className="flex items-baseline gap-3">
                <p className="text-5xl font-bold text-primary">
                  {formatPrice(product.price)}
                </p>
              </div>
              <p className="text-sm text-text-secondary mt-2">
                {inStock
                  ? product.stockQuantity < 10
                    ? `Only {product.stockQuantity} left in stock - order soon!`
                    : 'In Stock'
                  : 'Currently unavailable'}
              </p>
            </div>

            {product.description && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Product Description</h2>
                <p className="text-text-secondary leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-border">
              <div className="text-center">
                <Truck className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-xs font-medium">Fast Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-xs font-medium">Secure Payment</p>
              </div>
              <div className="text-center">
                <Star className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-xs font-medium">Quality Guarantee</p>
              </div>
            </div>

            <AddToCartButton product={product} />

            <div className="text-xs text-text-muted space-y-1 pt-4 border-t border-border">
              <p>SKU: {product.sku || 'N/A'}</p>
              <p>Listed on {formatDate(product.createdAt)}</p>
              <p>{product.viewCount} views</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
