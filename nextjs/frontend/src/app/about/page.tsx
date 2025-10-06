import { Metadata } from 'next'
import { Users, Shield, Award, Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'About Us - Your Trusted Marketplace',
  description: 'Learn about MarketPlace - your trusted online marketplace connecting buyers and sellers with quality products and exceptional service.',
  openGraph: {
    title: 'About Us - Your Trusted Marketplace',
    description: 'Learn about MarketPlace - your trusted online marketplace connecting buyers and sellers with quality products and exceptional service.',
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-900 mb-6">
              About <span className="text-gradient">MarketPlace</span>
            </h1>
            <p className="text-xl text-secondary-600 leading-relaxed">
              We're building the future of online commerce by connecting buyers and sellers 
              in a trusted, secure, and user-friendly marketplace.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900">
                  Our Mission
                </h2>
                <p className="text-lg text-secondary-600 leading-relaxed">
                  To create a seamless, secure, and enjoyable shopping experience that empowers 
                  both buyers and sellers. We believe in the power of community-driven commerce 
                  and strive to make quality products accessible to everyone.
                </p>
                <p className="text-lg text-secondary-600 leading-relaxed">
                  Our platform is designed with trust, transparency, and user satisfaction at 
                  its core, ensuring that every transaction is safe and every interaction is meaningful.
                </p>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center">
                  <Heart className="h-24 w-24 text-primary-600" />
                </div>
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-accent-200/30 to-primary-200/30 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-secondary-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              These core principles guide everything we do and shape our commitment to excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center group hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                  <Shield className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-3">Trust & Security</h3>
                <p className="text-secondary-600">
                  We prioritize the safety and security of our users with advanced encryption and fraud protection.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-success-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-success-200 transition-colors">
                  <Award className="h-8 w-8 text-success-600" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-3">Quality First</h3>
                <p className="text-secondary-600">
                  Every product is verified for quality and authenticity to ensure customer satisfaction.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-accent-200 transition-colors">
                  <Users className="h-8 w-8 text-accent-600" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-3">Community Focus</h3>
                <p className="text-secondary-600">
                  We foster a supportive community where buyers and sellers can thrive together.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-warning-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-warning-200 transition-colors">
                  <Heart className="h-8 w-8 text-warning-600" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-3">Customer Care</h3>
                <p className="text-secondary-600">
                  Exceptional customer service is at the heart of everything we do.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Our Impact
            </h2>
            <p className="text-xl text-primary-100">
              Numbers that reflect our commitment to excellence
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">10K+</div>
              <div className="text-primary-100">Products Listed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">500+</div>
              <div className="text-primary-100">Active Sellers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">50K+</div>
              <div className="text-primary-100">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">99.9%</div>
              <div className="text-primary-100">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              The passionate individuals behind MarketPlace, working tirelessly to create 
              the best possible experience for our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "CEO & Founder",
                description: "Visionary leader with 10+ years in e-commerce and technology."
              },
              {
                name: "Michael Chen",
                role: "CTO",
                description: "Tech expert focused on building scalable and secure platforms."
              },
              {
                name: "Emily Rodriguez",
                role: "Head of Customer Success",
                description: "Dedicated to ensuring every customer has an amazing experience."
              }
            ].map((member, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-12 w-12 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">{member.name}</h3>
                  <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                  <p className="text-secondary-600">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-secondary-50">
        <div className="container-custom text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900">
              Join Our Community
            </h2>
            <p className="text-xl text-secondary-600">
              Whether you're looking to buy amazing products or sell your own, 
              MarketPlace is the perfect place to start your journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/products" 
                className="inline-flex items-center px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Start Shopping
              </a>
              <a 
                href="/register" 
                className="inline-flex items-center px-8 py-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium"
              >
                Become a Seller
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}



