import { Card, CardContent } from '@/components/ui/card'

export default function ProductSkeleton() {
  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <div className="h-8 bg-secondary-200 rounded w-64 mb-2 animate-pulse"></div>
        <div className="h-4 bg-secondary-200 rounded w-32 animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Skeleton */}
        <div className="lg:col-span-1 space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <div className="p-4 space-y-4">
                <div className="h-5 bg-secondary-200 rounded w-24 animate-pulse"></div>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-8 bg-secondary-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Products Grid Skeleton */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-0">
                  {/* Image Skeleton */}
                  <div className="aspect-square bg-secondary-200 animate-pulse"></div>
                  
                  {/* Content Skeleton */}
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-secondary-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-secondary-200 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-secondary-200 rounded w-1/2 animate-pulse"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-secondary-200 rounded w-16 animate-pulse"></div>
                      <div className="h-4 bg-secondary-200 rounded w-12 animate-pulse"></div>
                    </div>
                    <div className="h-4 bg-secondary-200 rounded w-2/3 animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="mt-8 flex justify-between items-center">
            <div className="h-4 bg-secondary-200 rounded w-32 animate-pulse"></div>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-8 w-8 bg-secondary-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



