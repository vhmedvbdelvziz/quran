import type { Metadata } from "next";
import { Almarai } from "next/font/google";
import "./globals.css";

const almarai = Almarai({
  variable: "--font-almarai",
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
});

export const metadata: Metadata = {
  title: "Noor Al-Quran",
  description: "Noor Al-Quran Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${almarai.variable} antialiased`}>{children}</body>
    </html>
  );
}
