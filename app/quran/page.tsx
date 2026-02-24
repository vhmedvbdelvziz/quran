import { SiteHeader } from "@/components/site-header";
import { QuranPage } from "@/components/quran-page";
import { getJuzList, getSuraList, getTotalPages } from "@/lib/quran-data";

export default function Quran() {
  const juzList = getJuzList();
  const suraList = getSuraList();
  const totalPages = getTotalPages();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SiteHeader />
      <QuranPage juzList={juzList} suraList={suraList} totalPages={totalPages} />
    </div>
  );
}
