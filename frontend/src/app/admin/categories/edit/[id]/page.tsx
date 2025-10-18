'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { useRouter, useParams } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'


export default function EditCategoryPage() {
  const router = useRouter()
  const params = useParams()
  const categoryId = params.id as string

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })

  useEffect(() => {
    fetchCategory()
  }, [categoryId])

  const fetchCategory = async () => {
    try {
      const response = await fetch(`${API_URL}/api/categories/${categoryId}`)
      const result = await response.json()
      
      if (result.success) {
        const category = result.data
        setFormData({
          name: category.name,
          description: category.description || '',
        })
      } else {
        toast.error('Failed to fetch category')
        router.push('/admin/categories')
      }
    } catch (error) {
      toast.error('Failed to fetch category '+ error.message)
      router.push('/admin/categories')
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/categories/${categoryId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Category updated successfully')
        router.push('/admin/categories')
      } else {
        toast.error(result.message || 'Failed to update category')
      }
    } catch (error) {
      toast.error('Failed to update category')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (fetching) {
    return (
      <div className="container-custom py-8">
        <div className="text-center">Loading category...</div>
      </div>
    )
  }

  return (
    <div className="container-custom py-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Category</h1>
        <p className="text-gray-600 mt-2">Update category details</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow border p-6 space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Category Name *
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Electronics, Clothing, Books"
            required
            minLength={1}
            maxLength={100}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe this category..."
            rows={4}
            maxLength={500}
          />
        </div>

        <div className="flex space-x-4 pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Category'}
          </Button>
          <Button type="button" variant="outline" asChild>
            <a href="/admin/categories">Cancel</a>
          </Button>
        </div>
      </form>
    </div>
  )
}