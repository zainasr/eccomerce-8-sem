"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Search, SlidersHorizontal } from 'lucide-react';
import { API_URL, ROUTES } from '@/lib/constants';
import type { Product, Category } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function ProductCardSkeleton() {
  return (
    <div className="card h-full animate-pulse">
      <div className="aspect-square bg-slate-200 rounded-t-xl" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-3/4 bg-slate-200 rounded" />
        <div className="h-8 w-24 bg-slate-200 rounded" />
        <div className="h-4 w-1/3 bg-slate-200 rounded" />
      </div>
    </div>
  );
}

export type ProductsClientProps = {
  categories: Category[];
  initialProducts: Product[];
  initialTotalPages: number;
  initialPage: number;
  initialFilters?: Partial<{
    search: string;
    categoryIds: string[];
    minPrice: string;
    maxPrice: string;
    status: string;
    inStock: string;
    sortBy: string;
    sortOrder: string;
  }>;
};

export default function ProductsClient({
  categories,
  initialProducts,
  initialTotalPages,
  initialPage,
  initialFilters,
}: ProductsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [page, setPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: initialFilters?.search || '',
    categoryIds: initialFilters?.categoryIds || [],
    minPrice: initialFilters?.minPrice || '',
    maxPrice: initialFilters?.maxPrice || '',
    status: initialFilters?.status || '',
    inStock: initialFilters?.inStock || '',
    sortBy: initialFilters?.sortBy || 'createdAt',
    sortOrder: initialFilters?.sortOrder || 'desc',
  });

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', '12');
    if (filters.search) params.set('search', filters.search);
    if (filters.categoryIds.length > 0) params.set('categoryId', filters.categoryIds.join(','));
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.status) params.set('status', filters.status);
    if (filters.inStock) params.set('inStock', filters.inStock);
    params.set('sortBy', filters.sortBy);
    params.set('sortOrder', filters.sortOrder);
    return params.toString();
  }, [page, filters]);

  useEffect(() => {
    // Skip fetching on first render if initialProducts already match initial filters
    if (page === initialPage && JSON.stringify(filters) === JSON.stringify({
      search: initialFilters?.search || '',
      categoryIds: initialFilters?.categoryIds || [],
      minPrice: initialFilters?.minPrice || '',
      maxPrice: initialFilters?.maxPrice || '',
      status: initialFilters?.status || '',
      inStock: initialFilters?.inStock || '',
      sortBy: initialFilters?.sortBy || 'createdAt',
      sortOrder: initialFilters?.sortOrder || 'desc',
    })) {
      return;
    }

    (async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/products/get-all-products?${queryString}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setProducts(data.data?.products || []);
          setTotalPages(data.data?.pagination?.totalPages || 1);
        }
      } catch {}
      setIsLoading(false);
    })();
  }, [queryString]);

  const clearAllFilters = () => {
    setFilters({ search: '', categoryIds: [], minPrice: '', maxPrice: '', status: '', inStock: '', sortBy: 'createdAt', sortOrder: 'desc' });
    setPage(1);
  };

  const changeCategory = (id: string) => {
    setFilters((prev) => ({ ...prev, categoryIds: id ? [id] : [] }));
    setPage(1);
  };

  return (
    <div className="py-8 md:py-12">
      {/* Top toolbar */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-xl">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <Input
              placeholder="Search products"
              className="pl-9"
              value={filters.search}
              onChange={(e) => { setFilters({ ...filters, search: e.target.value }); setPage(1); }}
            />
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Label htmlFor="category" className="text-sm">Category</Label>
            <select id="category" className="input" value={filters.categoryIds[0] || ''} onChange={(e) => changeCategory(e.target.value)}>
              <option value="">All</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <Label htmlFor="sortBy" className="text-sm">Sort by</Label>
            <select id="sortBy" className="input" value={filters.sortBy} onChange={(e) => { setFilters({ ...filters, sortBy: e.target.value }); setPage(1); }}>
              <option value="createdAt">Newest</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="viewCount">Popularity</option>
            </select>
            <select className="input" value={filters.sortOrder} onChange={(e) => { setFilters({ ...filters, sortOrder: e.target.value }); setPage(1); }}>
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>
        </div>
        <Button variant="outline" className="md:hidden" onClick={() => setSidebarOpen((s) => !s)}>
          <SlidersHorizontal className="h-4 w-4 mr-2" /> Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className={`md:col-span-3 ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
          <div className="rounded-xl border border-border/50 bg-white p-5 md:p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-border/50">
              <h2 className="font-semibold text-lg">Filters</h2>
              <button className="text-sm text-primary hover:underline font-medium transition-colors" onClick={clearAllFilters}>Clear all</button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categorySide">Category</Label>
              <select id="categorySide" className="input" value={filters.categoryIds[0] || ''} onChange={(e) => changeCategory(e.target.value)}>
                <option value="">All</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="minPrice">Min price</Label>
                <Input id="minPrice" type="number" inputMode="decimal" value={filters.minPrice} onChange={(e) => { setFilters({ ...filters, minPrice: e.target.value }); setPage(1); }} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxPrice">Max price</Label>
                <Input id="maxPrice" type="number" inputMode="decimal" value={filters.maxPrice} onChange={(e) => { setFilters({ ...filters, maxPrice: e.target.value }); setPage(1); }} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select id="status" className="input" value={filters.status} onChange={(e) => { setFilters({ ...filters, status: e.target.value }); setPage(1); }}>
                <option value="">All</option>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <select id="stock" className="input" value={filters.inStock} onChange={(e) => { setFilters({ ...filters, inStock: e.target.value }); setPage(1); }}>
                <option value="">All</option>
                <option value="true">In Stock</option>
                <option value="false">Out of Stock</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Products grid */}
        <section className="md:col-span-9">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="product-grid">
                {products.map((product) => (
                  <Link key={product.id} href={ROUTES.PRODUCT_DETAIL(product.slug)} className="group">
                    <article className="card h-full hover:-translate-y-2 hover:shadow-xl transition-all duration-300 border-border/50">
                      <div className="aspect-square relative bg-surface rounded-t-xl overflow-hidden">
                        {product.images && product.images[0] ? (
                          <Image
                            src={product.images[0].imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-slate-100">
                            <Package className="h-16 w-16 text-slate-300" />
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-snug">{product.name}</h3>
                        <p className="text-2xl font-bold text-primary mb-2">{formatPrice(product.price)}</p>
                        {product.stockQuantity < 10 && product.stockQuantity > 0 && (
                          <p className="text-sm text-warning mt-1 font-medium">Only {product.stockQuantity} left</p>
                        )}
                        {product.stockQuantity === 0 && (
                          <p className="text-sm text-error mt-1 font-medium">Out of stock</p>
                        )}
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-8 border-t border-border/50 pt-6">
                <span className="text-sm text-text-secondary font-medium">Page {page} of {totalPages}</span>
                <div className="flex items-center gap-3">
                  <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="shadow-sm hover:shadow-md transition-shadow">Previous</Button>
                  <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="shadow-sm hover:shadow-md transition-shadow">Next</Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-text-secondary">No products found</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
