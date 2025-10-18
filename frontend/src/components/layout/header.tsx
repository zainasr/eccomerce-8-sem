'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useAuth } from '@/contexts/AuthContext'
import { LogOut, Menu, Search, Settings, ShoppingBag, ShoppingCart, Store, User } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

export default function Header() {
  const { user, isAuthenticated, logout, isInitialized, switchRole, isLoading } = useAuth()

  const [searchQuery, setSearchQuery] = useState('')

  // Don't render auth-dependent content until initialized
  if (!isInitialized || isLoading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-secondary-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container-custom">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-600 to-accent-600"></div>
              <span className="text-xl font-bold text-gradient">MarketPlace</span>
            </Link>
            {/* Loading skeleton */}
            <div className="flex items-center space-x-4">
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  const handleLogout = () => {
    logout()
  }

  const handleSwitchRole = async () => {
    if (!user) return
    const target = user.role === 'buyer' ? 'seller' : 'buyer'
    try {
      await switchRole(target)
      toast.success(`Switched to ${target}. Please sign in again.`)
      window.location.href = '/login'
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to switch role')
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-secondary-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-600 to-accent-600"></div>
            <span className="text-xl font-bold text-gradient">MarketPlace</span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-500" />
              <Input
                type="search"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>
          </form>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/products" className="text-sm font-medium text-secondary-700 hover:text-primary-600 transition-colors">
              Products
            </Link>
            <Link href="/about" className="text-sm font-medium text-secondary-700 hover:text-primary-600 transition-colors">
              About
            </Link>

            {/* User Actions */}
            <div className="flex items-center space-x-6">
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary-600 text-xs text-white flex items-center justify-center">
                    0
                  </span>
                </Button>
              </Link>

              {isAuthenticated && user ? (
                <div className="flex items-center space-x-4">
                  {/* Seller Badge */}
                  {user.role === 'seller' && (
                    <div className="hidden md:flex items-center space-x-2 bg-accent-50 text-accent-700 px-3 py-1 rounded-full text-sm">
                      <Store className="h-4 w-4" />
                      <span>Seller</span>
                    </div>
                  )}

                  {/* User Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="p-0 h-8 w-8 relative">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-black ring-2 ring-primary-100 ring-offset-2">
                          {user.username?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success-500 ring-2 ring-white" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="font-medium">{user.username}</p>
                          <p className="text-xs text-secondary-500">{user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      {user.role === 'seller' && (
                        <div className="space-y-2">
                        <DropdownMenuItem asChild>
                          <Link href="/seller-dashboard" className="cursor-pointer">
                            <Store className="mr-2 h-4 w-4" />
                            <span>Seller Dashboard</span>
                          </Link>
                        </DropdownMenuItem>
                         <DropdownMenuItem asChild>
                         <Link href="/seller-orders" className="cursor-pointer">
                           <ShoppingBag className="mr-2 h-4 w-4" />
                           <span>Orders</span>
                         </Link>
                       </DropdownMenuItem>
                       <DropdownMenuSeparator />
                       </div>
                      )}
                     
                      <DropdownMenuItem onClick={handleSwitchRole} className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Switch to {user.role === 'buyer' ? 'Seller' : 'Buyer'}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-500" />
                    <Input
                      type="search"
                      placeholder="Search for products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4"
                    />
                  </div>
                </form>

                {/* Mobile Navigation */}
                <div className="space-y-6">
                  <div className="flex flex-col space-y-2">
                    <Link href="/products" className="text-lg font-medium">
                      Products
                    </Link>
                    <Link href="/about" className="text-lg font-medium">
                      About
                    </Link>
                  </div>

                  {isAuthenticated && user ? (
                    <div className="space-y-6">
                      <div className="border-t border-b border-secondary-200 py-4">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-black text-lg">
                            {user.username?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{user.username}</p>
                            <p className="text-sm text-secondary-500">{user.email}</p>
                          </div>
                        </div>
                        {user.role === 'seller' && (
                          <div className="flex items-center space-x-2 bg-accent-50 text-accent-700 px-3 py-2 rounded-lg text-sm mb-4">
                            <Store className="h-4 w-4" />
                            <span>Seller Account</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Link href="/profile" className="flex items-center space-x-2 text-secondary-900 py-2">
                          <User className="h-5 w-5" />
                          <span>Profile</span>
                        </Link>
                        {user.role === 'seller' && (
                          <div className="space-y-2">
                          <Link href="/seller-dashboard" className="flex items-center space-x-2 text-secondary-900 py-2">
                            <Store className="h-5 w-5" />
                            <span>Seller Dashboard</span>
                          </Link>
                          <Link href="/seller-orders" className="flex items-center space-x-2 text-secondary-900 py-2">
                            <ShoppingBag className="h-5 w-5" />
                            <span>Orders</span>
                          </Link>
                          </div>
                        )}
                        <button onClick={handleSwitchRole} className="w-full flex items-center space-x-2 text-secondary-900 py-2">
                          <Settings className="h-5 w-5" />
                          <span>Switch to {user.role === 'buyer' ? 'Seller' : 'Buyer'}</span>
                        </button>
                        <button onClick={handleLogout} className="w-full flex items-center space-x-2 text-red-600 py-2">
                          <LogOut className="h-5 w-5" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button asChild className="w-full" variant="default">
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button asChild className="w-full" variant="outline">
                        <Link href="/register">Create Account</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
