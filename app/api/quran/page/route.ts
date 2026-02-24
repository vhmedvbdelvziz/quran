import { NextResponse } from "next/server";
import { fetchVersesPaginated, getChapterNameMap, parseVerseKey } from "@/lib/quran-api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageParam = Number(searchParams.get("page"));
  const totalPages = 604;

  if (!pageParam || Number.isNaN(pageParam) || pageParam < 1 || pageParam > totalPages) {
    return NextResponse.json({ error: "Invalid page" }, { status: 400 });
  }

  try {
    const verses = await fetchVersesPaginated(`/verses/by_page/${pageParam}`, {
      fields: "text_uthmani,verse_key",
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
      };
    });

    return NextResponse.json({ page: pageParam, ayahs });
  } catch {
    return NextResponse.json({ error: "Failed to load page" }, { status: 500 });
  }
}
