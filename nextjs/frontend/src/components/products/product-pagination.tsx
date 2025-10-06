'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PaginationResponse } from '@/lib/api'

interface ProductPaginationProps {
  pagination: PaginationResponse
  currentFilters: Record<string, string | undefined>
}

export default function ProductPagination({ pagination, currentFilters }: ProductPaginationProps) {
  const { page, totalPages, total } = pagination
  
  if (totalPages <= 1) return null

  const generatePageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      const startPage = Math.max(1, page - 2)
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
      
      if (startPage > 1) {
        pages.push(1)
        if (startPage > 2) {
          pages.push('...')
        }
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...')
        }
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams()
    
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value)
      }
    })
    
    params.set('page', pageNumber.toString())
    
    return `/products?${params.toString()}`
  }

  const pageNumbers = generatePageNumbers()

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
      {/* Results Info */}
      <div className="text-sm text-secondary-600">
        Showing {((page - 1) * pagination.limit) + 1} to {Math.min(page * pagination.limit, total)} of {total} results
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center space-x-2">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          asChild={page > 1}
        >
          {page > 1 ? (
            <a href={createPageUrl(page - 1)} className="flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </a>
          ) : (
            <span className="flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </span>
          )}
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {pageNumbers.map((pageNum, index) => (
            <div key={index}>
              {pageNum === '...' ? (
                <span className="px-3 py-2 text-sm text-secondary-500">...</span>
              ) : (
                <Button
                  variant={page === pageNum ? "default" : "outline"}
                  size="sm"
                  asChild={page !== pageNum}
                >
                  {page === pageNum ? (
                    <span>{pageNum}</span>
                  ) : (
                    <a href={createPageUrl(pageNum as number)}>{pageNum}</a>
                  )}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          disabled={page === totalPages}
          asChild={page < totalPages}
        >
          {page < totalPages ? (
            <a href={createPageUrl(page + 1)} className="flex items-center">
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          ) : (
            <span className="flex items-center">
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}


