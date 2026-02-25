import type { Metadata, Viewport } from "next";
import { Almarai } from "next/font/google";
import "./globals.css";
import { PWAInstaller } from "@/components/pwa-installer";

const almarai = Almarai({
  variable: "--font-almarai",
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
});

export const metadata: Metadata = {
  title: "Noor Al-Quran - نور القرآن",
  description: "تطبيق قرآن حديث - اقرأ القرآن الكريم مع التفاسير والتلاوات",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "نور القرآن",
  },
  icons: [
    { rel: "icon", url: "/logo.png", sizes: "512x512", type: "image/png" },
    { rel: "apple-touch-icon", url: "/logo.png", sizes: "512x512" },
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1f2937" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${almarai.variable} antialiased bg-background text-foreground`}>
        <PWAInstaller />
        {children}
      </body>
    </html>
  );
}
