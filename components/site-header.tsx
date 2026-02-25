"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full border-b bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col px-4 py-4 sm:px-6 lg:py-2">
        <div className="grid grid-cols-3 items-center gap-3 lg:grid-cols-3" dir="ltr">
          <div className="flex items-center justify-start gap-2 sm:gap-3">
            <div className="lg:hidden">
              <ThemeToggle />
            </div>
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>
          </div>

          <div className="flex justify-center">
            <nav className="hidden items-center justify-center gap-10 text-sm font-medium lg:flex" dir="rtl">
              <Link href="/" className="whitespace-nowrap transition-opacity hover:opacity-70">
                الرئيسية
              </Link>
              <Link href="/quran" className="whitespace-nowrap transition-opacity hover:opacity-70">
                القران الكريم
              </Link>
              <Link href="/prayer-times" className="whitespace-nowrap transition-opacity hover:opacity-70">
                مواعيد الصلاه
              </Link>
              <Link href="/azkar" className="whitespace-nowrap transition-opacity hover:opacity-70">
                الاذكار
              </Link>
              <Link href="/contact" className="whitespace-nowrap transition-opacity hover:opacity-70">
                اتصل بنا
              </Link>
            </nav>
            <Link href="/" className="flex items-center lg:hidden">
              <Image src="/logo.png" alt="Noor Al-Quran Logo" width={90} height={90} priority />
            </Link>
          </div>

          <div className="flex items-center justify-end gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              className="grid h-10 w-10 place-items-center rounded-md transition-colors hover:bg-black/5 lg:hidden dark:hover:bg-white/10"
              aria-label="القائمة"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
            <Link href="/" className="hidden items-center gap-2 sm:gap-3 lg:flex">
              <span className="text-sm font-bold">نور القران</span>
              <Image src="/logo.png" alt="Noor Al-Quran Logo" width={90} height={90} priority />
            </Link>
          </div>
        </div>

        {isMenuOpen && (
          <nav
            className="mt-4 flex flex-col gap-2 rounded-md border p-3 text-xs font-medium lg:hidden"
            dir="rtl"
          >
            <Link
              href="/"
              className="rounded-md px-3 py-2 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
              onClick={() => setIsMenuOpen(false)}
            >
              الرئيسية
            </Link>
            <Link
              href="/quran"
              className="rounded-md px-3 py-2 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
              onClick={() => setIsMenuOpen(false)}
            >
              القران الكريم
            </Link>
            <Link
              href="/prayer-times"
              className="rounded-md px-3 py-2 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
              onClick={() => setIsMenuOpen(false)}
            >
              مواعيد الصلاه
            </Link>
            <Link
              href="/azkar"
              className="rounded-md px-3 py-2 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
              onClick={() => setIsMenuOpen(false)}
            >
              الاذكار
            </Link>
            <Link
              href="/contact"
              className="rounded-md px-3 py-2 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
              onClick={() => setIsMenuOpen(false)}
            >
              اتصل بنا
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
