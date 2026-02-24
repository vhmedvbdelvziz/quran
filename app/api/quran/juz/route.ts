import { NextResponse } from "next/server";
import { fetchVersesPaginated, getChapterNameMap, parseVerseKey } from "@/lib/quran-api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const juzParam = Number(searchParams.get("juz"));

  if (!juzParam || Number.isNaN(juzParam) || juzParam < 1 || juzParam > 30) {
    return NextResponse.json({ error: "Invalid juz" }, { status: 400 });
  }

  try {
    const verses = await fetchVersesPaginated(`/verses/by_juz/${juzParam}`, {
      fields: "text_uthmani,verse_key,page_number",
      per_page: "1000",
    });
    const chapterMap = await getChapterNameMap();
    const ayahs = verses.map((verse) => {
      const { sura, ayah } = parseVerseKey(verse.verse_key);
      return {
        text: verse.text_uthmani,
        sura,
        ayah,
        suraName: chapterMap.get(sura) ?? `سورة ${sura}`,
        pageNumber: verse.page_number ?? null,
      };
    });
    const pageNumbers = ayahs
      .map((item) => item.pageNumber)
      .filter((value): value is number => typeof value === "number");
    const startPage = pageNumbers.length ? Math.min(...pageNumbers) : 1;
    const endPage = pageNumbers.length ? Math.max(...pageNumbers) : startPage;

    return NextResponse.json({
      juz: juzParam,
      startPage,
      endPage,
      ayahs: ayahs.map(({ pageNumber, ...rest }) => rest),
    });
  } catch {
    return NextResponse.json({ error: "Failed to load juz" }, { status: 500 });
  }
}
