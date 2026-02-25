"use client";

import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="mb-4 flex items-center gap-3">
              <Image src="/logo.png" alt="Noor Al-Quran Logo" width={50} height={50} />
              <span className="text-xl font-bold">نور القران</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              منصة إسلامية تهدف إلى تقريب القرآن الكريم والأذكار ومواقيت الصلاة لكل
              مسلم، سائلين الله القبول والتوفيق.
            </p>
          </div>

          {/* Quick Links - Azkar */}
          <div>
            <h3 className="mb-4 font-bold">أذكار مختارة</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/azkar#after-prayer"
                  className="text-muted-foreground transition-colors hover:font-medium"
                >
                  أذكار بعد الصلاة
                </Link>
              </li>
              <li>
                <Link
                  href="/azkar#morning"
                  className="text-muted-foreground transition-colors hover:font-medium"
                >
                  أذكار الصباح
                </Link>
              </li>
              <li>
                <Link
                  href="/azkar#evening"
                  className="text-muted-foreground transition-colors hover:font-medium"
                >
                  أذكار المساء
                </Link>
              </li>
              <li>
                <Link
                  href="/azkar#sleep"
                  className="text-muted-foreground transition-colors hover:font-medium"
                >
                  أذكار النوم
                </Link>
              </li>
            </ul>
          </div>

          {/* Pages Links */}
          <div>
            <h3 className="mb-4 font-bold">الصفحات</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground transition-colors hover:font-medium">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link
                  href="/quran"
                  className="text-muted-foreground transition-colors hover:font-medium"
                >
                  القران الكريم
                </Link>
              </li>
              <li>
                <Link
                  href="/prayer-times"
                  className="text-muted-foreground transition-colors hover:font-medium"
                >
                  مواعيد الصلاة
                </Link>
              </li>
              <li>
                <Link
                  href="/azkar"
                  className="text-muted-foreground transition-colors hover:font-medium"
                >
                  الأذكار
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground transition-colors hover:font-medium"
                >
                  اتصل بنا
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 border-t" />

        {/* Bottom Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>© 2026 جميع الحقوق محفوظة – أحمد عبدالعزيز</p>
        </div>
      </div>
    </footer>
  );
}
