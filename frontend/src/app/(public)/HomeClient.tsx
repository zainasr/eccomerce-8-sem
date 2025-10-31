"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ROUTES } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import { ArrowRight, ShoppingBag, Package, ShoppingCart, CreditCard, Store } from 'lucide-react';
import type { Product, Category } from '@/types';

interface HomeClientProps {
  categories: Category[];
  products: Product[];
}

export default function HomeClient({ categories, products }: HomeClientProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <motion.section initial={{opacity:0, y:0, scale:.98}} animate={{opacity:1, y:0, scale:1}} transition={{duration:.9}} className="relative py-16 md:py-28 bg-gradient-to-br from-primary/5 to-black/0 flex items-center">
        <div className="container flex flex-col-reverse md:flex-row gap-10 md:gap-16 items-center">
          <motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{delay:.25, duration:.9}} className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">The Future of Online Shopping</h1>
            <p className="text-xl text-text-secondary mb-8 max-w-xl mx-auto md:mx-0">Experience an innovative, beautiful & trustworthy marketplace. Start shopping & discover your next favorite product—right here.</p>
            <Link href={ROUTES.PRODUCTS}><Button size="lg" className="mt-2">Shop Now <ArrowRight className="ml-2 h-5 w-5" /></Button></Link>
          </motion.div>
          <motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{delay:.45, duration:.9}} className="flex-1 w-full flex justify-center md:justify-end">
            <div className="rounded-2xl overflow-hidden border shadow-lg bg-white/70 backdrop-blur-md">
              <Image src="/window.svg" alt="Showcase" width={360} height={320} className="w-full max-w-sm md:max-w-xs lg:max-w-sm h-auto object-contain mx-auto" priority loading="eager" />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* How it works */}
      <motion.section initial={{opacity:0, y:40}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:.8}} className="py-16 bg-white border-b border-border">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-9">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div whileHover={{scale:1.06}} className="flex flex-col gap-4 items-center">
              <Store className="h-14 w-14 text-primary mb-3" />
              <h3 className="font-semibold text-lg">1. Explore Products</h3>
              <p className="text-center text-text-secondary">Browse thousands of curated items across categories. Discover top brands and trending essentials.</p>
            </motion.div>
            <motion.div whileHover={{scale:1.06}} className="flex flex-col gap-4 items-center">
              <ShoppingCart className="h-14 w-14 text-primary mb-3" />
              <h3 className="font-semibold text-lg">2. Add to Cart</h3>
              <p className="text-center text-text-secondary">Add your favorite products to your cart with a single click. Tracking and management is seamless.</p>
            </motion.div>
            <motion.div whileHover={{scale:1.06}} className="flex flex-col gap-4 items-center">
              <CreditCard className="h-14 w-14 text-primary mb-3" />
              <h3 className="font-semibold text-lg">3. Fast Checkout</h3>
              <p className="text-center text-text-secondary">Check out quickly with secure payment and ultra-fast order handling. Enjoy best-in-class delivery speed.</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Categories */}
      {categories.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .8 }} className="bg-surface">
          <div className="container pb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-7 text-center">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <Link key={category.id} href={ROUTES.CATEGORY(category.slug)} className="group">
                  <Card className="hover:shadow-xl transition-transform hover:-translate-y-1">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 mx-auto mb-3 bg-primary-light rounded-full flex items-center justify-center group-hover:bg-black transition-colors duration-200">
                        <ShoppingBag className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                      </div>
                      <h3 className="font-semibold text-md group-hover:text-primary transition-colors">{category.name}</h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Banner */}
      <motion.section initial={{opacity:0, y:40}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:.8}} className="py-10 md:py-14">
        <div className="container">
          <div className="rounded-2xl bg-gradient-to-r from-primary to-black p-12 md:p-16 text-white text-center flex flex-col gap-3">
            <span className="text-lg font-semibold uppercase tracking-wider opacity-80">Seasonal Top Picks</span>
            <span className="block text-3xl md:text-4xl font-bold">Unlock New Favorites, Daily</span>
            <Link href={ROUTES.PRODUCTS}><Button size="lg" variant="secondary" className="mt-4">Browse All Products</Button></Link>
          </div>
        </div>
      </motion.section>

      {/* Featured Products */}
      {products.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .8, delay: 0.2 }}>
          <div className="container">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
              <Link href={ROUTES.PRODUCTS}><Button variant="outline" className="hidden md:flex">View All <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
            </div>
            <div className="product-grid">
              {products.map((product) => (
                <Link key={product.id} href={ROUTES.PRODUCT_DETAIL(product.slug)} className="group">
                  <motion.article initial={{opacity:0, y:40}} whileInView={{opacity:1, y:0}} transition={{duration:.7}} viewport={{once:true}} className="card h-full hover:-translate-y-1 transition-all duration-200">
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
                              className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                            />
                          );
                        })()
                      ) : (
                        <div className="flex items-center justify-center h-full bg-slate-100"><Package className="h-16 w-16 text-slate-300" /></div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">{product.name}</h3>
                      <p className="text-2xl font-bold text-primary">{formatPrice(product.price)}</p>
                    </div>
                  </motion.article>
                </Link>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* About */}
      <motion.section initial={{opacity:0, y:40}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:.8}} className="py-16 bg-surface">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center flex flex-col gap-7">
            <h2 className="text-2xl md:text-3xl font-bold">About ShopHub</h2>
            <p className="text-text-secondary text-lg mb-2 max-w-xl mx-auto">ShopHub brings you a modern, seamless online buying experience. We work directly with top suppliers and brands to offer handpicked, quality products at competitive prices—without the noise. Built for shoppers who value ease, speed, and trust.</p>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
