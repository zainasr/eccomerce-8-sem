/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Star, Truck, Shield, Heart, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'


interface ProductDetailPageProps {
  params: Promise<{
    id: string
  }>
}

async function getProduct(id: string) {
  try {
    const res = await fetch(`http://localhost:3000/api/products/${id}`, {
      next: { revalidate: 60 } // Cache for 1 minute
    })
   
    
    if (!res.ok) {
      if (res.status === 404) {
        return null
      }
      throw new Error('Failed to fetch product')
    }
    const data = await res.json()
    
   
    return data.data
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

async function getRelatedProducts(categoryIds: string[], excludeId: string) {
  if (!categoryIds.length) return []
  
  try {
    const params = new URLSearchParams({
      limit: '4',
      status: 'active',
    
    })
    
    const res = await fetch(`http://localhost:3000/api/products/get-all-products?${params.toString()}`, {
      next: { revalidate: 300 } // Cache for 5 minutes
    })
    console.log("res : ", res)
   
    
    const data = await res.json()
    return (data.data?.products || []).filter((p: any) => p.id !== excludeId).slice(0, 4)
  } catch (error) {
    console.error('Error fetching related products:', error)
    return []
  }
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)
  
  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: `${product.name} - Marketplace`,
    description: product.description || `Buy ${product.name} from trusted sellers. ${product.seoDescription || ''}`,
    keywords: product.seoKeywords || `${product.name}, products, marketplace`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images?.length > 0 ? [product.images[0].imageUrl] : [],
    },
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params
  console.log("id : ", id)
  const product = await getProduct(id)
  
  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(
    product.categories?.map((c: any) => c.id) || [],
    id
  )

  const primaryImage = product.images?.find((img: any) => img.isPrimary) || product.images?.[0]
  const otherImages = product.images?.filter((img: any) => img.id !== primaryImage?.id) || []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary-600">Products</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-lg border overflow-hidden">
              {primaryImage ? (
                <img
                  src={primaryImage.imageUrl}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                  // priority
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {otherImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {otherImages.map((image: any) => (
                  <div key={image.id} className="aspect-square bg-white rounded border overflow-hidden cursor-pointer hover:border-primary-300 transition-colors">
                    <Image
                      src={image.imageUrl}
                      alt={`${product.name} view ${otherImages.indexOf(image) + 2}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Product Title & Price */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-primary-600">
                  ${typeof product.price === 'string' ? product.price : product.price}
                </span>
                {product.sku && (
                  <span className="text-sm text-gray-500">SKU: {product.sku}</span>
                )}
              </div>
              
              {/* Status Badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  product.status === 'active' ? 'bg-green-100 text-green-800' :
                  product.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {product.status}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600">{product.viewCount || 0} views</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Categories */}
            {product.categories && product.categories.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {product.categories.map((category: any) => (
                    <Link
                      key={category.id}
                      href={`/products?categoryId=${category.id}`}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm hover:bg-primary-200 transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Availability</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">In Stock:</span>
                  <span className="font-medium">
                    {product.stockQuantity > 0 ? `${product.stockQuantity} available` : 'Out of Stock'}
                  </span>
                </div>
                {product.stockQuantity <= product.lowStockThreshold && product.stockQuantity > 0 && (
                  <div className="flex justify-between text-orange-600">
                    <span>Stock Level:</span>
                    <span className="font-medium">Low Stock</span>
                  </div>
                )}
                {product.allowBackorder && (
                  <div className="flex justify-between text-blue-600">
                    <span>Backorder:</span>
                    <span className="font-medium">Available</span>
                  </div>
                )}
              </div>
            </div>

            {/* Seller Information */}
            {product.seller && (
              <div className="bg-white border rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Sold by</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold">
                      {product.seller.username?.charAt(0).toUpperCase() || 'S'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.seller.username}</p>
                    <p className="text-sm text-gray-600">Verified Seller</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <Button size="lg" className="flex-1" disabled={product.stockQuantity === 0}>
                  {product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  <span>Free shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Secure payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct: any) => (
                <Link key={relatedProduct.id} href={`/products/${relatedProduct.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-0">
                      <div className="aspect-square bg-gray-100 relative overflow-hidden">
                        {relatedProduct.images?.[0] ? (
                          <Image
                            src={relatedProduct.images[0].imageUrl}
                            alt={relatedProduct.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-gray-400">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                          {relatedProduct.name}
                        </h3>
                        <p className="text-lg font-bold text-primary-600">
                          ${typeof relatedProduct.price === 'string' ? relatedProduct.price : relatedProduct.price}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
