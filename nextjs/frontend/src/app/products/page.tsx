import { Suspense } from 'react'
import { Metadata } from 'next'
import { productService } from '@/services/product.service'
import ProductGrid from '@/components/products/product-grid'
import ProductFilters from '@/components/products/product-filters'
import ProductSkeleton from '@/components/products/product-skeleton'

export const metadata: Metadata = {
  title: 'Products - Discover Amazing Items',
  description: 'Browse our extensive collection of products from trusted sellers. Find electronics, fashion, home goods, and more.',
  openGraph: {
    title: 'Products - Discover Amazing Items',
    description: 'Browse our extensive collection of products from trusted sellers. Find electronics, fashion, home goods, and more.',
  },
}

interface ProductsPageProps {
  searchParams: {
    page?: string
    limit?: string
    search?: string
    categoryId?: string
    minPrice?: string
    maxPrice?: string
    status?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }
}

async function ProductsContent({ searchParams }: ProductsPageProps) {
  const params = {
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    limit: searchParams.limit ? parseInt(searchParams.limit) : 12,
    search: searchParams.search,
    categoryId: searchParams.categoryId,
    minPrice: searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined,
    status: searchParams.status || 'active',
    sortBy: searchParams.sortBy || 'createdAt',
    sortOrder: searchParams.sortOrder || 'desc',
  }

  try {
    const [productsResponse, categoriesResponse] = await Promise.all([
      productService.getProducts(params),
      productService.getCategories({ limit: 100 })
    ])

    return (
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            {searchParams.search ? `Search Results for "${searchParams.search}"` : 'All Products'}
          </h1>
          <p className="text-secondary-600">
            {productsResponse.pagination.total} products found
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilters 
              categories={categoriesResponse.categories}
              currentFilters={searchParams}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <ProductGrid 
              products={productsResponse.products}
              pagination={productsResponse.pagination}
              currentFilters={searchParams}
            />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching products:', error)
    return (
      <div className="container-custom py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
            Unable to load products
          </h2>
          <p className="text-secondary-600 mb-6">
            There was an error loading the products. Please try again later.
          </p>
          <a 
            href="/products" 
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try Again
          </a>
        </div>
      </div>
    )
  }
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductsContent searchParams={searchParams} />
    </Suspense>
  )
}
