import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "مواعيد الصلاة",
  description:
    "تابع مواقيت الصلاة الدقيقة حسب مدينتك مع عرض الوقت الحالي بالتوقيت المحلي لكل مدينة.",
  alternates: {
    canonical: "/prayer-times",
  },
};

export default function PrayerTimesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
