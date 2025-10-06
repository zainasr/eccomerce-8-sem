import Link from 'next/link'
import { ArrowRight, Star, Shield, Truck, Headphones, Laptop, Shirt, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20 lg:py-32">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-900 leading-tight">
                  Discover Amazing
                  <span className="text-gradient block">Products</span>
                  <span className="text-secondary-600 text-2xl sm:text-3xl lg:text-4xl font-normal">
                    from Trusted Sellers
                  </span>
                </h1>
                <p className="text-lg text-secondary-600 max-w-lg leading-relaxed">
                  Shop from thousands of verified sellers. Find everything you need 
                  from electronics to fashion, all in one secure marketplace.
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
                  <Card className="card-hover p-4">
                    <CardContent className="p-0">
                      <div className="aspect-square bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-3 flex items-center justify-center">
                        <Headphones className="h-8 w-8 text-primary-600" />
                      </div>
                      <h3 className="font-semibold text-sm">Electronics</h3>
                      <p className="text-xs text-secondary-600">Latest gadgets</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="card-hover p-4 mt-8">
                    <CardContent className="p-0">
                      <div className="aspect-square bg-gradient-to-br from-accent-100 to-accent-200 rounded-lg mb-3 flex items-center justify-center">
                        <Shirt className="h-8 w-8 text-accent-600" />
                      </div>
                      <h3 className="font-semibold text-sm">Fashion</h3>
                      <p className="text-xs text-secondary-600">Trendy styles</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="card-hover p-4">
                    <CardContent className="p-0">
                      <div className="aspect-square bg-gradient-to-br from-success-100 to-success-200 rounded-lg mb-3 flex items-center justify-center">
                        <Home className="h-8 w-8 text-success-600" />
                      </div>
                      <h3 className="font-semibold text-sm">Home & Garden</h3>
                      <p className="text-xs text-secondary-600">Quality items</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="card-hover p-4 mt-8">
                    <CardContent className="p-0">
                      <div className="aspect-square bg-gradient-to-br from-warning-100 to-warning-200 rounded-lg mb-3 flex items-center justify-center">
                        <Laptop className="h-8 w-8 text-warning-600" />
                      </div>
                      <h3 className="font-semibold text-sm">Computers</h3>
                      <p className="text-xs text-secondary-600">Tech essentials</p>
                    </CardContent>
                  </Card>
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
    </div>
  )
}