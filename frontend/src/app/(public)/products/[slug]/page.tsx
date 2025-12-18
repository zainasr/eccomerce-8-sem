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
      <div className="container py-10 md:py-16">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-text-secondary" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li className="hover:text-primary transition-colors">Home</li>
            <li>/</li>
            {product.categories?.length > 0 && (
              <>
                <li className="hover:text-primary transition-colors">{product.categories[0].name}</li>
                <li>/</li>
              </>
            )}
            <li className="text-text font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Product Images */}
          <section className="space-y-5">
            <div className="aspect-square relative bg-surface rounded-2xl overflow-hidden border border-border/50 shadow-lg">
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
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                  <span className="bg-error text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image) => (
                  <div
                    key={image.id}
                    className="aspect-square relative bg-surface rounded-xl overflow-hidden border-2 border-border/50 hover:border-primary transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
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
          <section className="space-y-8">
            <header>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text mb-4 leading-tight">
                {product.name}
              </h1>
              {product.categories && product.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.categories.map((category) => (
                    <Badge key={category.id} className="badge-primary">
                      {category.name}
                    </Badge>
                  ))}
                </div>
              )}
            </header>

            <div className="border-t border-b border-border/50 py-8">
              <div className="flex items-baseline gap-3 mb-3">
                <p className="text-5xl md:text-6xl font-bold text-primary">
                  {formatPrice(product.price)}
                </p>
              </div>
              <p className="text-base text-text-secondary font-medium">
                {inStock
                  ? product.stockQuantity < 10
                    ? `Only ${product.stockQuantity} left in stock - order soon!`
                    : 'In Stock'
                  : 'Currently unavailable'}
              </p>
            </div>

            {product.description && (
              <div className="pt-4">
                <h2 className="text-xl md:text-2xl font-semibold mb-4">Product Description</h2>
                <p className="text-text-secondary leading-relaxed text-base">{product.description}</p>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 py-8 border-t border-border/50">
              <div className="text-center p-4 rounded-lg hover:bg-surface/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <p className="text-xs font-semibold">Fast Shipping</p>
              </div>
              <div className="text-center p-4 rounded-lg hover:bg-surface/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <p className="text-xs font-semibold">Secure Payment</p>
              </div>
              <div className="text-center p-4 rounded-lg hover:bg-surface/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <p className="text-xs font-semibold">Quality Guarantee</p>
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
