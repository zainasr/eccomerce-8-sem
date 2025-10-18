/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Headphones, Home, Laptop, Shield, Shirt, Star, Tag, Truck } from 'lucide-react'

import Link from 'next/link'

export default async function HomePage() {


 


  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20 lg:py-32 overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-600"></span>
                  </span>
                  <span>Trusted by 50K+ Customers</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-900 leading-tight">
                  <span className="inline-block">Discover Amazing</span>
                  <span className="text-gradient block mt-2">Products</span>
                  <span className="text-secondary-600 text-2xl sm:text-3xl lg:text-4xl font-normal mt-4 block">
                    from Verified Sellers
                  </span>
                </h1>
                <p className="text-lg text-secondary-600 max-w-lg leading-relaxed">
                  Your one-stop destination for quality products. Browse our curated collection
                  from trusted sellers worldwide.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="text-base px-8 py-3">
                  <Link href="/products">
                    Start Shopping
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="text-base px-8 py-3">
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">10K+</div>
                  <div className="text-sm text-secondary-600">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">500+</div>
                  <div className="text-sm text-secondary-600">Sellers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">50K+</div>
                  <div className="text-sm text-secondary-600">Happy Customers</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <div className="grid grid-cols-2 gap-4">
                  
                </div>
              </div>

              {/* Background decoration */}
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-primary-200/20 to-accent-200/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-gradient-to-tr from-accent-200/20 to-primary-200/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 mb-4">
              Why Choose MarketPlace?
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              We provide a secure, reliable, and user-friendly platform for all your shopping needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900">Secure Payments</h3>
              <p className="text-secondary-600">
                Your transactions are protected with industry-standard encryption and fraud protection.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-success-100 rounded-2xl flex items-center justify-center mx-auto">
                <Truck className="h-8 w-8 text-success-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900">Fast Shipping</h3>
              <p className="text-secondary-600">
                Quick and reliable delivery options to get your products to you as fast as possible.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto">
                <Star className="h-8 w-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900">Quality Guarantee</h3>
              <p className="text-secondary-600">
                All products are verified for quality and authenticity by our trusted seller network.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-warning-100 rounded-2xl flex items-center justify-center mx-auto">
                <Headphones className="h-8 w-8 text-warning-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900">24/7 Support</h3>
              <p className="text-secondary-600">
                Our customer support team is always ready to help you with any questions or issues.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Featured Categories Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center space-x-2 text-success-600 mb-2">
                <Tag className="h-5 w-5" />
                <span className="text-sm font-medium uppercase tracking-wider">Categories</span>
              </div>
              <h2 className="text-2xl font-bold text-secondary-900">
                Shop by Category
              </h2>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/categories">
                All Categories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="container-custom text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Ready to Start Shopping?
            </h2>
            <p className="text-xl text-primary-100">
              Join thousands of satisfied customers and discover amazing products today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild className="text-base px-8 py-3">
                <Link href="/products">
                  Browse Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base px-8 py-3 border-white text-white hover:bg-white hover:text-primary-600">
                <Link href="/register">Create Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div >
  )
}