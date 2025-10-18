import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/AuthContext'
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: {
    default: 'MarketPlace - Your One-Stop Shopping Destination',
    template: '%s | MarketPlace'
  },
  description: 'Discover amazing products from trusted sellers. Shop electronics, clothing, home goods, and more in our secure marketplace.',
  keywords: ['marketplace', 'ecommerce', 'shopping', 'products', 'online store'],
  authors: [{ name: 'MarketPlace Team' }],
  creator: 'MarketPlace',
  publisher: 'MarketPlace',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'MarketPlace - Your One-Stop Shopping Destination',
    description: 'Discover amazing products from trusted sellers. Shop electronics, clothing, home goods, and more in our secure marketplace.',
    siteName: 'MarketPlace',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MarketPlace - Your One-Stop Shopping Destination',
    description: 'Discover amazing products from trusted sellers. Shop electronics, clothing, home goods, and more in our secure marketplace.',
    creator: '@marketplace',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
              {children}
            </main>
            <Footer />
          </div>
          <Toaster richColors position="bottom-right" />
        
        </AuthProvider>
      </body>
    </html>
  )
}