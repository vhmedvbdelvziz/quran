import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://noor-alquran.vhmedvbdelvziz.xyz";

export const metadata: Metadata = {
  title: "الرئيسية",
  description:
    "نور القرآن: منصة عربية تجمع قراءة القرآن الكريم، مواعيد الصلاة حسب المدينة، والأذكار اليومية.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "نور القرآن",
    description:
      "اقرأ القرآن الكريم وتابع مواعيد الصلاة وتصفح الأذكار اليومية من مكان واحد.",
    url: siteUrl,
    images: ["/logo.png"],
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "نور القرآن",
    url: siteUrl,
    inLanguage: "ar",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/quran`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <section className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-10 sm:py-12">
          <div className="flex items-center justify-center rounded-full border border-foreground/10 bg-background/80 p-4 shadow-sm">
            <Image src="/logo.png" alt="Noor Al-Quran Logo" width={120} height={120} priority />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-12">
        <h2 className="mb-6 text-center text-2xl font-bold">خدماتنا</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "القران الكريم", href: "/quran" },
            { title: "مواعيد الصلاه", href: "/prayer-times" },
            { title: "الاذكار", href: "/azkar" },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-xl border bg-card p-5 text-center shadow-sm transition-colors hover:border-foreground/30 hover:bg-foreground/5"
            >
              <div className="text-lg font-semibold">{item.title}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-12">
        <h2 className="mb-6 text-center text-2xl font-bold">بودكاستات</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="https://www.youtube.com/watch?v=RZEeGyUR6es"
            target="_blank"
            rel="noreferrer"
            className="group overflow-hidden rounded-xl border bg-card shadow-sm"
          >
            <img
              src="https://img.youtube.com/vi/RZEeGyUR6es/hqdefault.jpg"
              alt="Podcast 1"
              className="h-48 w-full object-cover transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
            />
          </a>
          <a
            href="https://www.youtube.com/watch?v=3u5uYyGKYU8&list=PLlXQj2VGUTmdUP1KDQ9pkmKJU-KDNOkwt&index=2"
            target="_blank"
            rel="noreferrer"
            className="group overflow-hidden rounded-xl border bg-card shadow-sm"
          >
            <img
              src="https://img.youtube.com/vi/3u5uYyGKYU8/hqdefault.jpg"
              alt="Podcast 2"
              className="h-48 w-full object-cover transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
            />
          </a>
          <a
            href="https://www.youtube.com/watch?v=RhTxjl_W_BM&list=PLCpK4282MCT-lBXi4Nodjzq1TDZsK9qwr&index=1"
            target="_blank"
            rel="noreferrer"
            className="group overflow-hidden rounded-xl border bg-card shadow-sm"
          >
            <img
              src="https://img.youtube.com/vi/RhTxjl_W_BM/hqdefault.jpg"
              alt="Podcast 3"
              className="h-48 w-full object-cover transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
            />
          </a>
        </div>
      </section>
    </div>
  );
}
