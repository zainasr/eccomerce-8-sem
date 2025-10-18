'use client'

import { useAuth } from '@/contexts/AuthContext'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isInitialized } = useAuth()

  useEffect(() => {
    if (isInitialized && user?.role !== 'admin') {
      redirect('/')
    }
  }, [user, isInitialized])

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Access Denied</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container-custom py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <nav className="flex space-x-6">
              <a href="/admin" className="text-gray-600 hover:text-gray-900">
                Overview
              </a>
              <a href="/admin/categories" className="text-gray-600 hover:text-gray-900">
                Categories
              </a>
            </nav>
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}