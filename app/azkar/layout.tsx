import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الأذكار",
  description:
    "أذكار الصباح والمساء والنوم وبعد الصلاة في واجهة عربية سهلة للقراءة والمتابعة اليومية.",
  alternates: {
    canonical: "/azkar",
  },
};

export default function AzkarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
