import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

type QuranDataRaw = {
  Sura: (number | string)[][];
  Juz: number[][];
  Page: number[][];
};

type SuraRange = {
  sura: number;
  start: number;
  end: number;
  name: string;
};

type PageAyah = {
  text: string;
  sura: number;
  ayah: number;
  suraName: string;
};

type PageData = {
  page: number;
  ayahs: PageAyah[];
};

type JuzItem = {
  juz: number;
  startPage: number;
  startSura: number;
  startAyah: number;
  startSuraName: string;
};

type SuraItem = {
  sura: number;
  name: string;
  ayahCount: number;
  startPage: number;
};

type SuraContent = {
  sura: number;
  name: string;
  startPage: number;
  endPage: number;
  ayahs: PageAyah[];
};

type JuzContent = {
  juz: number;
  startPage: number;
  endPage: number;
  ayahs: PageAyah[];
};

let cachedData: QuranDataRaw | null = null;
let cachedText: string[] | null = null;
let cachedSuraRanges: SuraRange[] | null = null;
let cachedPageStarts: number[] | null = null;

const TEXT_PATH = path.join(process.cwd(), "data", "quran-simple.txt");
const META_PATH = path.join(process.cwd(), "data", "quran-data.js");

function loadQuranData(): QuranDataRaw {
  if (cachedData) {
    return cachedData;
  }

  const code = fs.readFileSync(META_PATH, "utf8");
  const sandbox: { QuranData?: QuranDataRaw } = {};
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);

  if (!sandbox.QuranData) {
    throw new Error("Failed to load Quran metadata.");
  }

  cachedData = sandbox.QuranData;
  return cachedData;
}

function loadQuranText(): string[] {
  if (cachedText) {
    return cachedText;
  }

  const raw = fs.readFileSync(TEXT_PATH, "utf8");
  cachedText = raw.split(/\r?\n/).filter((line) => line.trim().length > 0);
  return cachedText;
}

function getSuraRanges(): SuraRange[] {
  if (cachedSuraRanges) {
    return cachedSuraRanges;
  }

  const data = loadQuranData();
  cachedSuraRanges = data.Sura.slice(1).map((entry, index) => {
    const start = Number(entry[0]);
    const ayas = Number(entry[1]);
    const name = String(entry[4]);

    return {
      sura: index + 1,
      start,
      end: start + ayas - 1,
      name,
    };
  });

  return cachedSuraRanges;
}

function buildAyahs(startIndex: number, endIndex: number): PageAyah[] {
  const text = loadQuranText();
  const ranges = getSuraRanges();
  let rangeIndex = ranges.findIndex((range) => startIndex >= range.start && startIndex <= range.end);

  if (rangeIndex === -1) {
    rangeIndex = 0;
  }

  const ayahs: PageAyah[] = [];
  for (let i = startIndex; i <= endIndex; i += 1) {
    while (ranges[rangeIndex] && i > ranges[rangeIndex].end) {
      rangeIndex += 1;
    }

    const range = ranges[rangeIndex];
    if (!range) {
      break;
    }

    ayahs.push({
      text: text[i],
      sura: range.sura,
      ayah: i - range.start + 1,
      suraName: range.name,
    });
  }

  return ayahs;
}

function suraAyahToIndex(sura: number, ayah: number): number {
  const data = loadQuranData();
  const entry = data.Sura[sura];

  if (!entry) {
    throw new Error(`Invalid sura: ${sura}`);
  }

  return Number(entry[0]) + ayah - 1;
}

function getPageStartIndexes(): number[] {
  if (cachedPageStarts) {
    return cachedPageStarts;
  }

  const data = loadQuranData();
  cachedPageStarts = data.Page.map((entry, index) => {
    if (index === 0) {
      return 0;
    }

    return suraAyahToIndex(entry[0], entry[1]);
  });

  return cachedPageStarts;
}

function findPageByIndex(index: number): number {
  const pageStarts = getPageStartIndexes();
  let low = 1;
  let high = pageStarts.length - 1;
  let result = 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (pageStarts[mid] <= index) {
      result = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return result;
}

export function getTotalPages(): number {
  const data = loadQuranData();
  return data.Page.length - 1;
}

export function getPageData(page: number): PageData {
  const data = loadQuranData();

  if (page < 1 || page >= data.Page.length) {
    throw new Error("Page out of range");
  }

  const [startSura, startAyah] = data.Page[page];
  const startIndex = suraAyahToIndex(startSura, startAyah);

  const nextPage = data.Page[page + 1];
  const endIndex = nextPage
    ? suraAyahToIndex(nextPage[0], nextPage[1]) - 1
    : loadQuranText().length - 1;

  return { page, ayahs: buildAyahs(startIndex, endIndex) };
}

export function getJuzList(): JuzItem[] {
  const data = loadQuranData();

  return data.Juz.slice(1, 31).map((entry, index) => {
    const [sura, ayah] = entry;
    const startIndex = suraAyahToIndex(sura, ayah);
    const startPage = findPageByIndex(startIndex);
    const suraName = String(data.Sura[sura][4]);

    return {
      juz: index + 1,
      startPage,
      startSura: sura,
      startAyah: ayah,
      startSuraName: suraName,
    };
  });
}

export function getSuraList(): SuraItem[] {
  const data = loadQuranData();

  return data.Sura.slice(1).map((entry, index) => {
    const sura = index + 1;
    const startIndex = Number(entry[0]);
    const ayahCount = Number(entry[1]);
    const name = String(entry[4]);
    const startPage = findPageByIndex(startIndex);

    return {
      sura,
      name,
      ayahCount,
      startPage,
    };
  });
}

export function getSuraContent(sura: number): SuraContent {
  const data = loadQuranData();
  const entry = data.Sura[sura];

  if (!entry) {
    throw new Error("Invalid sura");
  }

  const startIndex = Number(entry[0]);
  const ayahCount = Number(entry[1]);
  const endIndex = startIndex + ayahCount - 1;
  const startPage = findPageByIndex(startIndex);
  const endPage = findPageByIndex(endIndex);
  const name = String(entry[4]);

  return {
    sura,
    name,
    startPage,
    endPage,
    ayahs: buildAyahs(startIndex, endIndex),
  };
}

export function getJuzContent(juz: number): JuzContent {
  if (juz < 1 || juz > 30) {
    throw new Error("Invalid juz");
  }

  const data = loadQuranData();
  const entry = data.Juz[juz];

  if (!entry) {
    throw new Error("Invalid juz");
  }

  const startIndex = suraAyahToIndex(entry[0], entry[1]);
  const nextEntry = data.Juz[juz + 1];
  const endIndex = nextEntry
    ? suraAyahToIndex(nextEntry[0], nextEntry[1]) - 1
    : loadQuranText().length - 1;

  return {
    juz,
    startPage: findPageByIndex(startIndex),
    endPage: findPageByIndex(endIndex),
    ayahs: buildAyahs(startIndex, endIndex),
  };
}
