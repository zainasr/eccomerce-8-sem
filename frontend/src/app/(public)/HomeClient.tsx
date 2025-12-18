"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ROUTES } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import { ArrowRight, ShoppingBag, Package, ShoppingCart, CreditCard, Store, BookOpen } from 'lucide-react';
import type { Product, Category, Blog } from '@/types';

interface HomeClientProps {
  categories: Category[];
  products: Product[];
  blogs: Blog[];
}

export default function HomeClient({ categories, products, blogs }: HomeClientProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <motion.section initial={{opacity:0, y:0, scale:.98}} animate={{opacity:1, y:0, scale:1}} transition={{duration:.9}} className="relative py-20 md:py-32 bg-gradient-to-br from-primary/5 via-primary/3 to-black/0 flex items-center">
        <div className="container flex flex-col-reverse md:flex-row gap-12 md:gap-20 items-center">
          <motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{delay:.25, duration:.9}} className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight">The Future of Online Shopping</h1>
            <p className="text-lg md:text-xl text-text-secondary mb-10 max-w-xl mx-auto md:mx-0 leading-relaxed">Experience an innovative, beautiful & trustworthy marketplace. Start shopping & discover your next favorite product—right here.</p>
            <Link href={ROUTES.PRODUCTS}><Button size="lg" className="mt-2 shadow-lg hover:shadow-xl transition-all duration-300">Shop Now <ArrowRight className="ml-2 h-5 w-5" /></Button></Link>
          </motion.div>
          <motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{delay:.45, duration:.9}} className="flex-1 w-full flex justify-center md:justify-end">
            <div className="rounded-2xl overflow-hidden border border-border/50 shadow-2xl bg-white/80 backdrop-blur-md hover:shadow-3xl transition-shadow duration-300">
              <Image src="/window.svg" alt="Showcase" width={360} height={320} className="w-full max-w-sm md:max-w-xs lg:max-w-sm h-auto object-contain mx-auto" priority loading="eager" />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* How it works */}
      <motion.section initial={{opacity:0, y:40}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:.8}} className="py-20 bg-white border-b border-border/50">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-5xl mx-auto">
            <motion.div whileHover={{scale:1.05, y:-4}} className="flex flex-col gap-5 items-center p-6 rounded-xl hover:bg-surface/50 transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Store className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-xl">1. Explore Products</h3>
              <p className="text-center text-text-secondary leading-relaxed">Browse thousands of curated items across categories. Discover top brands and trending essentials.</p>
            </motion.div>
            <motion.div whileHover={{scale:1.05, y:-4}} className="flex flex-col gap-5 items-center p-6 rounded-xl hover:bg-surface/50 transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <ShoppingCart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-xl">2. Add to Cart</h3>
              <p className="text-center text-text-secondary leading-relaxed">Add your favorite products to your cart with a single click. Tracking and management is seamless.</p>
            </motion.div>
            <motion.div whileHover={{scale:1.05, y:-4}} className="flex flex-col gap-5 items-center p-6 rounded-xl hover:bg-surface/50 transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-xl">3. Fast Checkout</h3>
              <p className="text-center text-text-secondary leading-relaxed">Check out quickly with secure payment and ultra-fast order handling. Enjoy best-in-class delivery speed.</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Categories */}
      {categories.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .8 }} className="bg-surface py-16">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {categories.map((category) => (
                <Link key={category.id} href={ROUTES.CATEGORY(category.slug)} className="group">
                  <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-border/50">
                    <CardContent className="p-6 md:p-8 text-center">
                      <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary transition-all duration-300 group-hover:scale-110">
                        <ShoppingBag className="h-7 w-7 text-primary group-hover:text-white transition-colors" />
                      </div>
                      <h3 className="font-semibold text-base group-hover:text-primary transition-colors">{category.name}</h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Banner */}
      <motion.section initial={{opacity:0, y:40}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:.8}} className="py-12 md:py-16">
        <div className="container">
          <div className="rounded-2xl bg-gradient-to-r from-primary via-primary/95 to-black p-12 md:p-20 text-white text-center flex flex-col gap-4 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
            <div className="relative z-10">
              <span className="text-base md:text-lg font-semibold uppercase tracking-wider opacity-90">Seasonal Top Picks</span>
              <span className="block text-3xl md:text-4xl lg:text-5xl font-bold mt-2 mb-6">Unlock New Favorites, Daily</span>
              <Link href={ROUTES.PRODUCTS}><Button size="lg" variant="secondary" className="mt-2 shadow-lg hover:shadow-xl transition-all duration-300">Browse All Products</Button></Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Featured Products */}
      {products.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .8, delay: 0.2 }} className="py-16 bg-white">
          <div className="container">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Featured Products</h2>
              <Link href={ROUTES.PRODUCTS}><Button variant="outline" className="hidden md:flex shadow-sm hover:shadow-md transition-shadow">View All <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
            </div>
            <div className="product-grid">
              {products.map((product) => (
                <Link key={product.id} href={ROUTES.PRODUCT_DETAIL(product.slug)} className="group">
                  <motion.article initial={{opacity:0, y:40}} whileInView={{opacity:1, y:0}} transition={{duration:.7}} viewport={{once:true}} className="card h-full hover:-translate-y-2 hover:shadow-xl transition-all duration-300 border-border/50">
                    <div className="aspect-square relative bg-surface rounded-t-xl overflow-hidden">
                      {product.images && product.images[0] && product.images[0].imageUrl ? (
                        (() => {
                          const raw = product.images![0].imageUrl;
                          const hasQuery = raw.includes("?");
                          const normalized = raw.startsWith("http") ? raw : `https://${raw.replace(/^\/+/, "")}`;
                          const src = `${normalized}${hasQuery ? "&" : "?"}auto=format&fit=crop&w=800&q=75`;
                          return (
                            <Image
                              src={src}
                              alt={product.name}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                              className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                            />
                          );
                        })()
                      ) : (
                        <div className="flex items-center justify-center h-full bg-slate-100"><Package className="h-16 w-16 text-slate-300" /></div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-snug">{product.name}</h3>
                      <p className="text-2xl font-bold text-primary">{formatPrice(product.price)}</p>
                    </div>
                  </motion.article>
                </Link>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Latest Blogs */}
      {blogs.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .8, delay: 0.2 }} className="py-16 bg-surface">
          <div className="container">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Latest Blogs</h2>
              <Link href={ROUTES.BLOGS}><Button variant="outline" className="hidden md:flex shadow-sm hover:shadow-md transition-shadow">View All <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {blogs.map((blog) => (
                <Link key={blog.id} href={`/blogs/${blog.slug}`} className="group">
                  <motion.article initial={{opacity:0, y:40}} whileInView={{opacity:1, y:0}} transition={{duration:.7}} viewport={{once:true}} className="card h-full hover:-translate-y-2 hover:shadow-xl transition-all duration-300 border-border/50">
                    <div className="aspect-video relative bg-slate-100 rounded-t-xl overflow-hidden">
                      {blog.coverImage ? (
                        <Image
                          src={blog.coverImage}
                          alt={blog.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-slate-100"><BookOpen className="h-16 w-16 text-slate-300" /></div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-snug">{blog.title}</h3>
                      {blog.excerpt && (
                        <p className="text-sm text-text-secondary mb-4 line-clamp-3 leading-relaxed">{blog.excerpt}</p>
                      )}
                      <div className="text-xs text-text-secondary font-medium">
                        {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Draft'}
                      </div>
                    </div>
                  </motion.article>
                </Link>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* About */}
      <motion.section initial={{opacity:0, y:40}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:.8}} className="py-20 bg-white border-t border-border/50">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center flex flex-col gap-8">
            <h2 className="text-3xl md:text-4xl font-bold">About ShopHub</h2>
            <p className="text-text-secondary text-lg md:text-xl mb-2 max-w-2xl mx-auto leading-relaxed">ShopHub brings you a modern, seamless online buying experience. We work directly with top suppliers and brands to offer handpicked, quality products at competitive prices—without the noise. Built for shoppers who value ease, speed, and trust.</p>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
