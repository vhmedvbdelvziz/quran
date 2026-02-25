import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "اتصل بنا",
  description:
    "تواصل مع فريق نور القرآن للاستفسارات والاقتراحات والإبلاغ عن أي مشكلة داخل الموقع.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
