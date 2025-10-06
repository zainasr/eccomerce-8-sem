'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Category } from '@/lib/api'

interface ProductFiltersProps {
  categories: Category[]
  currentFilters: Record<string, string | undefined>
}

export default function ProductFilters({ categories, currentFilters }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [localSearch, setLocalSearch] = useState(currentFilters.search || '')
  const [priceRange, setPriceRange] = useState({
    min: currentFilters.minPrice || '',
    max: currentFilters.maxPrice || ''
  })

  const updateFilters = (newFilters: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    
    // Reset to page 1 when filters change
    params.delete('page')
    
    router.push(`/products?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ search: localSearch })
  }

  const handleCategoryFilter = (categoryId: string) => {
    updateFilters({ categoryId: categoryId === currentFilters.categoryId ? undefined : categoryId })
  }

  const handlePriceFilter = () => {
    updateFilters({
      minPrice: priceRange.min || undefined,
      maxPrice: priceRange.max || undefined
    })
  }

  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    updateFilters({ sortBy, sortOrder })
  }

  const clearFilters = () => {
    setLocalSearch('')
    setPriceRange({ min: '', max: '' })
    router.push('/products')
  }

  const hasActiveFilters = Object.values(currentFilters).some(value => value && value !== '')

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-3">
            <Input
              placeholder="Search products..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
            <Button type="submit" className="w-full">
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Filters Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filters
        </h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant={!currentFilters.categoryId ? "default" : "ghost"}
            size="sm"
            className="w-full justify-start"
            onClick={() => handleCategoryFilter('')}
          >
            All Categories
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={currentFilters.categoryId === category.id ? "default" : "ghost"}
              size="sm"
              className="w-full justify-start"
              onClick={() => handleCategoryFilter(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
            />
            <Input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
            />
          </div>
          <Button onClick={handlePriceFilter} className="w-full" size="sm">
            Apply Price Filter
          </Button>
        </CardContent>
      </Card>

      {/* Sort Options */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Sort By</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant={currentFilters.sortBy === 'createdAt' && currentFilters.sortOrder === 'desc' ? "default" : "ghost"}
            size="sm"
            className="w-full justify-start"
            onClick={() => handleSortChange('createdAt', 'desc')}
          >
            Newest First
          </Button>
          <Button
            variant={currentFilters.sortBy === 'createdAt' && currentFilters.sortOrder === 'asc' ? "default" : "ghost"}
            size="sm"
            className="w-full justify-start"
            onClick={() => handleSortChange('createdAt', 'asc')}
          >
            Oldest First
          </Button>
          <Button
            variant={currentFilters.sortBy === 'price' && currentFilters.sortOrder === 'asc' ? "default" : "ghost"}
            size="sm"
            className="w-full justify-start"
            onClick={() => handleSortChange('price', 'asc')}
          >
            Price: Low to High
          </Button>
          <Button
            variant={currentFilters.sortBy === 'price' && currentFilters.sortOrder === 'desc' ? "default" : "ghost"}
            size="sm"
            className="w-full justify-start"
            onClick={() => handleSortChange('price', 'desc')}
          >
            Price: High to Low
          </Button>
          <Button
            variant={currentFilters.sortBy === 'name' && currentFilters.sortOrder === 'asc' ? "default" : "ghost"}
            size="sm"
            className="w-full justify-start"
            onClick={() => handleSortChange('name', 'asc')}
          >
            Name: A to Z
          </Button>
          <Button
            variant={currentFilters.sortBy === 'name' && currentFilters.sortOrder === 'desc' ? "default" : "ghost"}
            size="sm"
            className="w-full justify-start"
            onClick={() => handleSortChange('name', 'desc')}
          >
            Name: Z to A
          </Button>
          <Button
            variant={currentFilters.sortBy === 'viewCount' && currentFilters.sortOrder === 'desc' ? "default" : "ghost"}
            size="sm"
            className="w-full justify-start"
            onClick={() => handleSortChange('viewCount', 'desc')}
          >
            Most Popular
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}



