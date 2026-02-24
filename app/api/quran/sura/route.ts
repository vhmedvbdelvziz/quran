import { NextResponse } from "next/server";
import { fetchVersesPaginated, getChapterNameMap, parseVerseKey } from "@/lib/quran-api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const suraParam = Number(searchParams.get("sura"));

  if (!suraParam || Number.isNaN(suraParam) || suraParam < 1 || suraParam > 114) {
    return NextResponse.json({ error: "Invalid sura" }, { status: 400 });
  }

  try {
    const verses = await fetchVersesPaginated(`/verses/by_chapter/${suraParam}`, {
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
    const suraName = chapterMap.get(suraParam) ?? `سورة ${suraParam}`;

    return NextResponse.json({
      sura: suraParam,
      name: suraName,
      startPage,
      endPage,
      ayahs: ayahs.map(({ pageNumber, ...rest }) => rest),
    });
  } catch {
    return NextResponse.json({ error: "Failed to load sura" }, { status: 500 });
  }
}
