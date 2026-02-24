"use client";

import { Fragment, useEffect, useMemo, useState } from "react";

type StopPoint = {
  sura: number;
  ayah: number;
  suraName: string;
  contextType: "سورة" | "جزء" | "صفحة";
  contextTitle: string | null;
  contextMode: "page" | "juz" | "sura";
  juz?: number;
  page?: number;
  pagesCount?: number;
  viewPage?: number;
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

type PageAyah = {
  text: string;
  sura: number;
  ayah: number;
  suraName: string;
};

type PagePayload = {
  page: number;
  ayahs: PageAyah[];
};

type SuraPayload = {
  sura: number;
  name: string;
  startPage: number;
  endPage: number;
  ayahs: PageAyah[];
};

type JuzPayload = {
  juz: number;
  startPage: number;
  endPage: number;
  ayahs: PageAyah[];
};

type QuranPageProps = {
  juzList: JuzItem[];
  suraList: SuraItem[];
  totalPages: number;
};

const STOP_KEY = "quranStopPoints";

export function QuranPage({ juzList, suraList, totalPages }: QuranPageProps) {
  const [pageInput, setPageInput] = useState("");
  const [currentPage, setCurrentPage] = useState<number | null>(null);
  const [contentAyahs, setContentAyahs] = useState<PageAyah[] | null>(null);
  const [contentTitle, setContentTitle] = useState<string | null>(null);
  const [contentMeta, setContentMeta] = useState<string | null>(null);
  const [stopPoints, setStopPoints] = useState<StopPoint[]>([]);
  const [pendingStop, setPendingStop] = useState<StopPoint | null>(null);
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(null);
  const [pendingScrollId, setPendingScrollId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"juz" | "sura">("juz");
  const [contentMode, setContentMode] = useState<"page" | "juz" | "sura">("page");
  const [pagesCount, setPagesCount] = useState(20);
  const [viewPage, setViewPage] = useState(1);
  const [activeJuz, setActiveJuz] = useState<number | null>(null);
  const [activeSura, setActiveSura] = useState<number | null>(null);
  const juzItems = useMemo(() => juzList, [juzList]);
  const suraItems = useMemo(() => suraList, [suraList]);

  useEffect(() => {
    const storedStop = localStorage.getItem(STOP_KEY);
    if (storedStop) {
      try {
        const parsed = JSON.parse(storedStop) as StopPoint[];
        if (Array.isArray(parsed)) {
          setStopPoints(
            parsed
              .filter((item) => item?.sura && item?.ayah)
              .map((item) => ({
                ...item,
                contextMode: item.contextMode ?? "sura",
              })),
          );
        }
      } catch {
        localStorage.removeItem(STOP_KEY);
      }
    }

    const url = new URL(window.location.href);
    const pageParam = Number(url.searchParams.get("page"));
    if (!Number.isNaN(pageParam) && pageParam >= 1 && pageParam <= totalPages) {
      setPageInput(String(pageParam));
      void fetchPage(pageParam);
    }
  }, []);

  const updateUrl = (page: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", String(page));
    window.history.replaceState(null, "", url.toString());
  };

  const fetchPage = async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/quran/page?page=${page}`);
      if (!response.ok) {
        throw new Error("page");
      }

      const data = (await response.json()) as PagePayload;
      setContentAyahs(data.ayahs);
      setContentTitle("نص الصفحة");
      setContentMeta(`صفحة ${data.page}`);
      setCurrentPage(data.page);
      setPageInput(String(data.page));
      setContentMode("page");
      setViewMode("juz");
      setViewPage(1);
      setActiveJuz(null);
      setActiveSura(null);
      updateUrl(data.page);
    } catch {
      setError("تعذر تحميل الصفحة المطلوبة. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoToPage = () => {
    const page = Number(pageInput);
    if (Number.isNaN(page) || page < 1 || page > totalPages) {
      setError(`برجاء إدخال رقم صفحة من 1 إلى ${totalPages}.`);
      return;
    }

    void fetchPage(page);
  };

  const isPageView = contentMode === "page" && currentPage !== null;
  const isJuzView = contentMode === "juz" && contentTitle?.startsWith("الجزء ");
  const isSuraView = contentMode === "sura" && contentTitle?.startsWith("سورة ");

  const fetchSura = async (
    sura: number,
    options?: { restoreAyah?: { sura: number; ayah: number } },
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/quran/sura?sura=${sura}`);
      if (!response.ok) {
        throw new Error("sura");
      }

      const data = (await response.json()) as SuraPayload;
      setContentAyahs(data.ayahs);
      setContentTitle(`سورة ${data.name}`);
      setContentMeta(`صفحات ${data.startPage} - ${data.endPage}`);
      setCurrentPage(null);
      setViewMode("sura");
      setContentMode("sura");
      setViewPage(1);
      setActiveSura(sura);
      setActiveJuz(null);
      if (options?.restoreAyah) {
        setPendingScrollId(`ayah-${options.restoreAyah.sura}-${options.restoreAyah.ayah}`);
      }
    } catch {
      setError("تعذر تحميل السورة المطلوبة.");
    } finally {
      setLoading(false);
    }
  };

  const fetchJuz = async (
    juz: number,
    options?: {
      restorePagesCount?: number;
      restoreViewPage?: number;
      restoreAyah?: { sura: number; ayah: number };
    },
  ) => {
    setLoading(true);
    setError(null);

    if (options?.restorePagesCount && [5, 10, 20].includes(options.restorePagesCount)) {
      setPagesCount(options.restorePagesCount);
    }

    try {
      const response = await fetch(`/api/quran/juz?juz=${juz}`);
      if (!response.ok) {
        throw new Error("juz");
      }

      const data = (await response.json()) as JuzPayload;
      setContentAyahs(data.ayahs);
      setContentTitle(`الجزء ${data.juz}`);
      setContentMeta(`صفحات ${data.startPage} - ${data.endPage}`);
      setCurrentPage(null);
      setViewMode("juz");
      setContentMode("juz");
      setViewPage(options?.restoreViewPage && options.restoreViewPage > 0 ? options.restoreViewPage : 1);
      setActiveJuz(juz);
      setActiveSura(null);
      if (options?.restoreAyah) {
        setPendingScrollId(`ayah-${options.restoreAyah.sura}-${options.restoreAyah.ayah}`);
      }
    } catch {
      setError("تعذر تحميل الجزء المطلوب.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStop = () => {
    if (!pendingStop) {
      return;
    }

    const exists = stopPoints.some(
      (item) => item.sura === pendingStop.sura && item.ayah === pendingStop.ayah,
    );
    if (!exists) {
      const nextStops = [...stopPoints, pendingStop];
      localStorage.setItem(STOP_KEY, JSON.stringify(nextStops));
      setStopPoints(nextStops);
    }
    setPendingStop(null);
  };

  const handleDeleteStop = (index: number) => {
    const nextStops = stopPoints.filter((_, idx) => idx !== index);
    localStorage.setItem(STOP_KEY, JSON.stringify(nextStops));
    setStopPoints(nextStops);
    setPendingDeleteIndex(null);
  };

  const scrollToStopPoint = (target: StopPoint) => {
    if (target.contextMode === "juz" && target.juz) {
      void fetchJuz(target.juz, {
        restorePagesCount: target.pagesCount,
        restoreViewPage: target.viewPage,
        restoreAyah: { sura: target.sura, ayah: target.ayah },
      });
      return;
    }

    if (target.contextMode === "sura") {
      void fetchSura(target.sura, {
        restoreAyah: { sura: target.sura, ayah: target.ayah },
      });
      return;
    }

    const elementId = `ayah-${target.sura}-${target.ayah}`;
    setPendingScrollId(elementId);

    if (target.page) {
      void fetchPage(target.page);
    } else if (!contentAyahs?.some((ayah) => ayah.sura === target.sura && ayah.ayah === target.ayah)) {
      void fetchSura(target.sura, {
        restoreAyah: { sura: target.sura, ayah: target.ayah },
      });
    }
  };

  const pagedContent = useMemo(() => {
    if (!contentAyahs) {
      return { totalViewPages: 0, items: [] as PageAyah[] };
    }

    if (contentMode === "page" || contentMode === "sura") {
      return { totalViewPages: 1, items: contentAyahs };
    }

    const perPage = Math.max(1, Math.ceil(contentAyahs.length / pagesCount));
    const totalViewPages = Math.ceil(contentAyahs.length / perPage);
    const clampedPage = Math.min(Math.max(viewPage, 1), totalViewPages || 1);
    const start = (clampedPage - 1) * perPage;
    const end = start + perPage;

    return {
      totalViewPages,
      items: contentAyahs.slice(start, end),
      perPage,
      clampedPage,
    };
  }, [contentAyahs, contentMode, pagesCount, viewPage]);

  useEffect(() => {
    if (!pendingScrollId) {
      return;
    }

    const element = document.getElementById(pendingScrollId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      setPendingScrollId(null);
    }
  }, [pendingScrollId, contentAyahs, viewPage, pagesCount]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6" dir="rtl">
      <div className="grid gap-6 lg:grid-cols-[3fr_7fr]">
        <aside className="rounded-lg border p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">طريقة العرض</h2>
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setViewMode("juz")}
                className={`rounded-full px-3 py-1 transition-colors ${
                  viewMode === "juz"
                    ? "bg-foreground text-background"
                    : "border text-foreground"
                }`}
              >
                أجزاء
              </button>
              <button
                type="button"
                onClick={() => setViewMode("sura")}
                className={`rounded-full px-3 py-1 transition-colors ${
                  viewMode === "sura"
                    ? "bg-foreground text-background"
                    : "border text-foreground"
                }`}
              >
                سور
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {viewMode === "juz" && (
              <div className="space-y-2">
                {juzItems.map((juz) => (
                  <button
                    key={juz.juz}
                    type="button"
                    onClick={() => fetchJuz(juz.juz)}
                    className="flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm font-semibold transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    <span>الجزء {juz.juz}</span>
                    <span className="text-xs text-foreground/60">صفحة {juz.startPage}</span>
                  </button>
                ))}
              </div>
            )}

            {viewMode === "sura" && (
              <div className="space-y-2">
                {suraItems.map((sura) => (
                  <button
                    key={sura.sura}
                    type="button"
                    onClick={() => fetchSura(sura.sura)}
                    className="flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm font-semibold transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    <span>سورة {sura.name}</span>
                    <span className="text-xs text-foreground/60">{sura.ayahCount} آية</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        <section className="space-y-6">
          <div className="rounded-lg border p-4 sm:p-6">
            <div className="mt-4 rounded-md border p-3 sm:p-4">
              <h3 className="text-sm font-semibold">المحفوظات</h3>
              {stopPoints.length === 0 ? (
                <div className="mt-2 text-sm text-foreground/70">لا يوجد</div>
              ) : (
                <div className="mt-3 space-y-2">
                  {stopPoints.map((item, index) => (
                    <div
                      key={`${item.sura}-${item.ayah}-${index}`}
                      className="flex items-center justify-between rounded-md border px-3 py-2 text-xs"
                    >
                      <button
                        type="button"
                        onClick={() => scrollToStopPoint(item)}
                        className="text-right"
                      >
                        وقفت عند سورة {item.suraName} آية {item.ayah}
                        <div className="text-[11px] text-foreground/70">
                          {item.contextType} {item.contextTitle ?? ""}
                        </div>
                        {item.contextMode === "juz" && (
                          <div className="text-[11px] text-foreground/70">
                            تقسيم الجزء: {item.pagesCount ?? 20} صفحات • صفحة العرض: {item.viewPage ?? 1}
                          </div>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingDeleteIndex(index)}
                        className="rounded-full border px-2 py-0.5 text-[11px]"
                        aria-label="حذف المحفوظ"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
          </div>

          <div className="rounded-lg border p-4 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold">{contentTitle ?? "نص الصفحة"}</h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-foreground/60">
                {contentMeta && <span>{contentMeta}</span>}
                {contentMode === "juz" && (
                  <label className="flex items-center gap-2">
                    <span>عدد الصفحات</span>
                    <select
                      value={pagesCount}
                      onChange={(event) => {
                        setPagesCount(Number(event.target.value));
                        setViewPage(1);
                      }}
                      className="rounded-md border px-2 py-1 text-xs"
                    >
                      <option value={20}>20</option>
                      <option value={10}>10</option>
                      <option value={5}>5</option>
                    </select>
                  </label>
                )}
              </div>
            </div>
            {isPageView && (
              <div className="mt-4 flex items-center justify-between gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => currentPage > 1 && fetchPage(currentPage - 1)}
                  className="rounded-md border px-3 py-2 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                  disabled={!currentPage || currentPage <= 1}
                >
                  ← السابق
                </button>
                <button
                  type="button"
                  onClick={() => currentPage < totalPages && fetchPage(currentPage + 1)}
                  className="rounded-md border px-3 py-2 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                  disabled={!currentPage || currentPage >= totalPages}
                >
                  التالي →
                </button>
              </div>
            )}
            {loading && <div className="mt-4 text-sm text-foreground/70">جار التحميل...</div>}
            {!loading && contentAyahs && (
              <div className="mushaf-frame mt-6 rounded-2xl p-3 sm:p-4">
                <div className="mushaf-inner rounded-xl">
                  <div className="text-lg leading-10">
                    {pagedContent.items.map((ayah, index) => {
                      const previousAyah = index > 0 ? pagedContent.items[index - 1] : null;
                      const isNewSurah = !previousAyah || previousAyah.sura !== ayah.sura;

                      return (
                        <Fragment key={`${ayah.sura}-${ayah.ayah}`}>
                          {isNewSurah && (
                            <div className="mb-4 mt-2 flex justify-center">
                              <div className="surah-header">سورة {ayah.suraName}</div>
                            </div>
                          )}
                          <span id={`ayah-${ayah.sura}-${ayah.ayah}`} className="ml-1 inline">
                            {ayah.text}
                            <button
                              type="button"
                              onClick={() =>
                                setPendingStop({
                                  sura: ayah.sura,
                                  ayah: ayah.ayah,
                                  suraName: ayah.suraName,
                                  contextType: isSuraView ? "سورة" : isJuzView ? "جزء" : "صفحة",
                                  contextTitle: contentTitle,
                                  contextMode: contentMode,
                                  juz: isJuzView ? activeJuz ?? undefined : undefined,
                                  page: isPageView ? currentPage ?? undefined : undefined,
                                  pagesCount: isJuzView ? pagesCount : undefined,
                                  viewPage: isJuzView ? pagedContent.clampedPage ?? viewPage : undefined,
                                })
                              }
                              className="mx-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-foreground/60 text-xs transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                              aria-label={`تثبيت نقطة عند ${ayah.suraName} ${ayah.ayah}`}
                            >
                              {ayah.ayah}
                            </button>
                          </span>
                        </Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            {!isPageView && contentMode === "juz" && pagedContent.totalViewPages > 1 && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setViewPage((prev) => Math.max(1, prev - 1))}
                  className="rounded-md border px-3 py-2 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                  disabled={viewPage <= 1}
                >
                  ← السابق
                </button>
                <span>
                  صفحة {pagedContent.clampedPage ?? viewPage} من {pagedContent.totalViewPages}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setViewPage((prev) =>
                      Math.min(pagedContent.totalViewPages || prev, prev + 1),
                    )
                  }
                  className="rounded-md border px-3 py-2 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                  disabled={viewPage >= pagedContent.totalViewPages}
                >
                  التالي →
                </button>
              </div>
            )}
            {!isPageView && contentMode === "juz" && pagedContent.totalViewPages > 0 && viewPage === pagedContent.totalViewPages && (
              <div className="mt-4 rounded-md border bg-background/60 px-4 py-3 text-sm font-semibold">
                {isJuzView
                  ? `تم الانتهاء من قرائه ${contentTitle}`
                  : "تم الانتهاء من القراءه"}
              </div>
            )}
            {!loading && !contentAyahs && (
              <div className="mt-4 text-sm text-foreground/70">اختر جزءًا أو سورة لعرض النص.</div>
            )}
          </div>

          <div className="text-xs text-foreground/60">
            النص القرآني من مشروع <a className="underline" href="https://tanzil.net/">Tanzil</a> وفق شروط الاستخدام.
          </div>

        </section>
      </div>

      {pendingStop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-lg bg-background p-4 text-right">
            <h3 className="text-base font-semibold">نقطة التوقف</h3>
            <p className="mt-2 text-sm text-foreground/70">
              عاوز توقف قراءه لحد هنا؟ ({pendingStop.suraName} - آية {pendingStop.ayah})
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingStop(null)}
                className="rounded-md border px-3 py-2 text-xs font-semibold"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleSaveStop}
                className="rounded-md bg-foreground px-3 py-2 text-xs font-semibold text-background"
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      {pendingDeleteIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-lg bg-background p-4 text-right">
            <h3 className="text-base font-semibold">حذف المحفوظ</h3>
            <p className="mt-2 text-sm text-foreground/70">عاوز تمسح المحفوظ ده؟</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingDeleteIndex(null)}
                className="rounded-md border px-3 py-2 text-xs font-semibold"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => handleDeleteStop(pendingDeleteIndex)}
                className="rounded-md bg-foreground px-3 py-2 text-xs font-semibold text-background"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
