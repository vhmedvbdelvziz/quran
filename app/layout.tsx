import type { Metadata, Viewport } from "next";
import { Almarai } from "next/font/google";
import "./globals.css";
import { PWAInstaller } from "@/components/pwa-installer";
import { SiteFooter } from "@/components/site-footer";
import { Analytics } from "@vercel/analytics/next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://noor-alquran.vhmedvbdelvziz.xyz";
const siteName = "Noor Al-Quran | نور القرآن";

const almarai = Almarai({
  variable: "--font-almarai",
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: "%s | نور القرآن",
  },
  description:
    "اقرأ القرآن الكريم، تصفّح الأذكار اليومية، وتابع مواعيد الصلاة الدقيقة حسب مدينتك في تجربة عربية بسيطة وسريعة.",
  applicationName: "نور القرآن",
  keywords: [
    "القرآن الكريم",
    "نور القرآن",
    "مواعيد الصلاة",
    "الأذكار",
    "تفسير القرآن",
    "تلاوات القرآن",
    "Quran",
    "Prayer Times",
    "Azkar",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: siteUrl,
    siteName,
    title: siteName,
    description:
      "القرآن الكريم، الأذكار، ومواعيد الصلاة الدقيقة في موقع واحد مناسب للجوال والديسكتوب.",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "شعار نور القرآن",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: siteName,
    description:
      "القرآن الكريم، الأذكار، ومواعيد الصلاة الدقيقة في موقع واحد مناسب للجوال والديسكتوب.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
