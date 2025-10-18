/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense } from 'react'
import { Metadata } from 'next'
import ProductFilters from '@/components/products/product-filters'
import ProductGrid from '@/components/products/product-grid'
import ProductPagination from '@/components/products/product-pagination'
import ProductSkeleton from '@/components/products/product-skeleton'


export const metadata: Metadata = {
  title: 'Products - Marketplace',
  description: 'Browse thousands of products from trusted sellers. Find electronics, fashion, home goods and more.',
  keywords: 'products, marketplace, shopping, electronics, fashion, home goods',
}

interface SearchParams {
  page?: string
  limit?: string
  search?: string
  categoryId?: string
  minPrice?: string
  maxPrice?: string
  status?: string
  sortBy?: string
  sortOrder?: string
}

interface ProductsPageProps {
  searchParams: SearchParams
}

async function getProducts(searchParams: SearchParams) {
  const params = new URLSearchParams()
  
  // Set defaults and add search params
  params.set('page', searchParams.page || '1')
  params.set('limit', searchParams.limit || '12')
  if (searchParams.search) params.set('search', searchParams.search)
  if (searchParams.categoryId) params.set('categoryId', searchParams.categoryId)
  if (searchParams.minPrice) params.set('minPrice', searchParams.minPrice)
  if (searchParams.maxPrice) params.set('maxPrice', searchParams.maxPrice)
  if (searchParams.status) params.set('status', searchParams.status)
  params.set('sortBy', searchParams.sortBy || 'createdAt')
  params.set('sortOrder', searchParams.sortOrder || 'desc')

  try {
    const res = await fetch(`http://localhost:3000/api/products/get-all-products?${params.toString()}`, {
      next: { revalidate: 60 } // Cache for 1 minute
    })
    
    if (!res.ok) {
      throw new Error('Failed to fetch products')
    }
    
    return await res.json()
  } catch (error) {
    console.error('Error fetching products:', error)
    return { data: { products: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 0 } } }
  }
}

async function getCategories() {
  try {
    const res = await fetch(`http://localhost:3000/api/categories?limit=50`, {
      next: { revalidate: 300 } // Cache for 5 minutes
    })
    
    if (!res.ok) {
      throw new Error('Failed to fetch categories')
    }
    
    const data = await res.json()
    return data.data?.categories || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const [productsData, categories] = await Promise.all([
    getProducts(searchParams),
    getCategories()
  ])

  // Deduplicate products to prevent duplicates
  const fetchedProducts = productsData.data?.products || []
  const products = Array.from(new Map(fetchedProducts.map((p: any) => [p.id, p])).values())
  const pagination = productsData.data?.pagination || { page: 1, limit: 12, total: 0, totalPages: 0 }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Browse Products
          </h1>
          <p className="text-gray-600">
            Discover amazing products from trusted sellers
          </p>
          {pagination.total > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} products
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilters 
              categories={categories} searchParams={searchParams as Record<string, string>}             
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <Suspense fallback={<ProductSkeleton />}>
              <ProductGrid products={products}  />
            </Suspense>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8">
                <ProductPagination 
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                />
              </div>
            )}

            {/* Empty State */}
            {products.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your filters or search terms
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
