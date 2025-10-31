import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

const inter = Inter({ subsets: ["latin"] });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const SITE_NAME = "ShopHub";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Your Modern Online Store`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Discover quality products at great prices. Fast shipping, secure checkout, and excellent customer service.",
  keywords: [
    "online shopping",
    "e-commerce",
    "buy products online",
    "online store",
    "ShopHub",
  ],
  applicationName: SITE_NAME,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - Your Modern Online Store`,
    description:
      "Discover quality products at great prices. Fast shipping, secure checkout, and excellent customer service.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Your Modern Online Store`,
    description:
      "Discover quality products at great prices. Fast shipping, secure checkout, and excellent customer service.",
    creator: "@shophub",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <div style={{ flex: 1 }}>{children}</div>
        <Toaster duration={2000} richColors closeButton position="bottom-right" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: SITE_NAME,
              url: SITE_URL,
              logo: `${SITE_URL}/apple-touch-icon.png`,
            }),
          }}
        />
      </body>
    </html>
  );
}