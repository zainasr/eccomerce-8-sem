import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShopHub - Your Modern Online Store",
  description: "Discover quality products at great prices. Fast shipping, secure checkout, and excellent customer service.",
  keywords: "online shopping, e-commerce, buy products online, online store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)}/>
        {children}
        <Toaster duration={2000} richColors closeButton position="bottom-right"/>
       
      </body>
    </html>
  );
}