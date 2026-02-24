import { SiteHeader } from "@/components/site-header";
import { QuranPage } from "@/components/quran-page";
import { getChapters } from "@/lib/quran-api";

type JuzItem = {
  juz: number;
  startPage?: number | null;
};

type SuraItem = {
  sura: number;
  name: string;
  ayahCount: number;
  startPage?: number | null;
};

const TOTAL_PAGES = 604;

async function getJuzList(): Promise<JuzItem[]> {
  const response = await fetch("https://api.quran.com/api/v4/juzs");
  if (!response.ok) {
    throw new Error("Failed to load juz list");
  }

  const data = (await response.json()) as { juzs: { juz_number: number }[] };
  const unique = new Map<number, { juz_number: number }>();
  data.juzs.forEach((item) => {
    if (!unique.has(item.juz_number)) {
      unique.set(item.juz_number, item);
    }
  });

  return Array.from(unique.values())
    .sort((a, b) => a.juz_number - b.juz_number)
    .map((item) => ({ juz: item.juz_number, startPage: null }));
}

async function getSuraList(): Promise<SuraItem[]> {
  const chapters = await getChapters();
  return chapters.map((chapter) => ({
    sura: chapter.id,
    name: chapter.name_arabic,
    ayahCount: chapter.verses_count,
    startPage: chapter.pages?.[0] ?? null,
  }));
}

export default async function Quran() {
  const [juzList, suraList] = await Promise.all([getJuzList(), getSuraList()]);
  const totalPages = TOTAL_PAGES;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SiteHeader />
      <QuranPage juzList={juzList} suraList={suraList} totalPages={totalPages} />
    </div>
  );
}
