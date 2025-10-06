import Link from 'next/link'
import Image from 'next/image'
import { Star, Eye, ShoppingCart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Product, PaginationResponse } from '@/lib/api'
import ProductPagination from './product-pagination'

interface ProductGridProps {
  products: Product[]
  pagination: PaginationResponse
  currentFilters: Record<string, string | undefined>
}

export default function ProductGrid({ products, pagination, currentFilters }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingCart className="h-12 w-12 text-secondary-400" />
        </div>
        <h3 className="text-xl font-semibold text-secondary-900 mb-2">No products found</h3>
        <p className="text-secondary-600 mb-6">
          Try adjusting your search or filter criteria to find what you're looking for.
        </p>
        <Button asChild>
          <Link href="/products">View All Products</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Products Grid */}
      <div className="grid-responsive">
        {products.map((product) => (
          <Card key={product.id} className="card-hover group">
            <CardContent className="p-0">
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden rounded-t-xl">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0].imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-secondary-100 to-secondary-200 flex items-center justify-center">
                    <ShoppingCart className="h-12 w-12 text-secondary-400" />
                  </div>
                )}
                
                {/* Quick Actions Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" className="h-8 w-8 p-0">
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Status Badge */}
                {product.status === 'active' && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-success-500 text-white text-xs px-2 py-1 rounded-full">
                      In Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-3">
                {/* Categories */}
                {product.categories && product.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {product.categories.slice(0, 2).map((category) => (
                      <span
                        key={category.id}
                        className="text-xs bg-secondary-100 text-secondary-600 px-2 py-1 rounded"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Product Name */}
                <h3 className="font-semibold text-secondary-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                  <Link href={`/products/${product.id}`}>
                    {product.name}
                  </Link>
                </h3>

                {/* Seller Info */}
                {product.seller && (
                  <p className="text-sm text-secondary-500">
                    by {product.seller.username}
                  </p>
                )}

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xl font-bold text-primary-600">
                      ${typeof product.price === 'string' ? parseFloat(product.price).toFixed(2) : product.price.toFixed(2)}
                    </span>
                    {product.stockQuantity <= product.lowStockThreshold && (
                      <p className="text-xs text-warning-600">
                        Only {product.stockQuantity} left!
                      </p>
                    )}
                  </div>
                  
                  {/* View Count */}
                  <div className="flex items-center text-xs text-secondary-500">
                    <Eye className="h-3 w-3 mr-1" />
                    {product.viewCount}
                  </div>
                </div>

                {/* Stock Status */}
                <div className="flex items-center justify-between text-sm">
                  <span className={`font-medium ${
                    product.stockQuantity > 0 
                      ? 'text-success-600' 
                      : 'text-error-600'
                  }`}>
                    {product.stockQuantity > 0 
                      ? `${product.stockQuantity} in stock`
                      : 'Out of stock'
                    }
                  </span>
                  
                  {product.allowBackorder && product.stockQuantity === 0 && (
                    <span className="text-warning-600 font-medium">
                      Backorder available
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <ProductPagination 
        pagination={pagination}
        currentFilters={currentFilters}
      />
    </div>
  )
}


