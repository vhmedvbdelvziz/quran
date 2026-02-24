const API_BASE = "https://api.quran.com/api/v4";

type Chapter = {
  id: number;
  name_arabic: string;
  verses_count: number;
  pages?: number[];
};

type QuranVerse = {
  verse_key: string;
  text_uthmani: string;
  page_number?: number;
};

type VerseResponse = {
  verses: QuranVerse[];
  pagination?: {
    next_page: number | null;
  };
};

let chaptersCache: Chapter[] | null = null;
let chaptersPromise: Promise<Chapter[]> | null = null;

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch Quran API.");
  }
  return (await response.json()) as T;
}

export async function getChapters(): Promise<Chapter[]> {
  if (chaptersCache) {
    return chaptersCache;
  }

  if (!chaptersPromise) {
    chaptersPromise = fetchJson<{ chapters: Chapter[] }>(`${API_BASE}/chapters?language=ar`)
      .then((data) => data.chapters)
      .then((chapters) => {
        chaptersCache = chapters;
        return chapters;
      });
  }

  return chaptersPromise;
}

export async function getChapterNameMap(): Promise<Map<number, string>> {
  const chapters = await getChapters();
  const map = new Map<number, string>();
  chapters.forEach((chapter) => {
    map.set(chapter.id, chapter.name_arabic);
  });
  return map;
}

export function parseVerseKey(verseKey: string): { sura: number; ayah: number } {
  const [suraRaw, ayahRaw] = verseKey.split(":");
  return {
    sura: Number(suraRaw),
    ayah: Number(ayahRaw),
  };
}

export async function fetchVersesPaginated(
  endpoint: string,
  params: Record<string, string> = {},
): Promise<QuranVerse[]> {
  const verses: QuranVerse[] = [];
  let page = 1;

  while (true) {
    const url = new URL(`${API_BASE}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    url.searchParams.set("page", String(page));

    const data = await fetchJson<VerseResponse>(url.toString());
    verses.push(...data.verses);

    if (!data.pagination?.next_page) {
      break;
    }

    page = data.pagination.next_page;
  }

  return verses;
}
