import Image from "next/image";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-10 sm:py-12">
          <div className="flex items-center justify-center rounded-full border border-foreground/10 bg-background/80 p-4 shadow-sm">
            <Image src="/logo.png" alt="Noor Al-Quran Logo" width={120} height={120} priority />
          </div>
        </div>
      </section>
    </div>
  );
}
