"use client";

import { useState, useEffect } from "react";
import { SiteHeader } from "@/components/site-header";

interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
}

interface PrayerData {
  timings: PrayerTimes;
  date: {
    readable: string;
    hijri: {
      date: string;
      month: { ar: string };
      year: string;
      weekday: { ar: string };
    };
  };
  meta: {
    timezone: string;
  };
}

interface City {
  name: string;
  nameAr: string;
  country: string;
  countryAr: string;
}

const CITIES: City[] = [
  // Egypt
  { name: "Cairo", nameAr: "القاهرة", country: "Egypt", countryAr: "مصر" },
  { name: "Alexandria", nameAr: "الإسكندرية", country: "Egypt", countryAr: "مصر" },
  { name: "Giza", nameAr: "الجيزة", country: "Egypt", countryAr: "مصر" },
  { name: "Aswan", nameAr: "أسوان", country: "Egypt", countryAr: "مصر" },
  { name: "Luxor", nameAr: "الأقصر", country: "Egypt", countryAr: "مصر" },
  { name: "Mansoura", nameAr: "المنصورة", country: "Egypt", countryAr: "مصر" },
  { name: "Tanta", nameAr: "طنطا", country: "Egypt", countryAr: "مصر" },
  { name: "Asyut", nameAr: "أسيوط", country: "Egypt", countryAr: "مصر" },
  // Saudi Arabia
  { name: "Mecca", nameAr: "مكة المكرمة", country: "Saudi Arabia", countryAr: "السعودية" },
  { name: "Medina", nameAr: "المدينة المنورة", country: "Saudi Arabia", countryAr: "السعودية" },
  { name: "Riyadh", nameAr: "الرياض", country: "Saudi Arabia", countryAr: "السعودية" },
  { name: "Jeddah", nameAr: "جدة", country: "Saudi Arabia", countryAr: "السعودية" },
  { name: "Dammam", nameAr: "الدمام", country: "Saudi Arabia", countryAr: "السعودية" },
  // UAE
  { name: "Dubai", nameAr: "دبي", country: "United Arab Emirates", countryAr: "الإمارات" },
  { name: "Abu Dhabi", nameAr: "أبوظبي", country: "United Arab Emirates", countryAr: "الإمارات" },
  { name: "Sharjah", nameAr: "الشارقة", country: "United Arab Emirates", countryAr: "الإمارات" },
  // Jordan
  { name: "Amman", nameAr: "عمّان", country: "Jordan", countryAr: "الأردن" },
  { name: "Irbid", nameAr: "إربد", country: "Jordan", countryAr: "الأردن" },
  // Kuwait
  { name: "Kuwait City", nameAr: "الكويت", country: "Kuwait", countryAr: "الكويت" },
  // Qatar
  { name: "Doha", nameAr: "الدوحة", country: "Qatar", countryAr: "قطر" },
  // Lebanon
  { name: "Beirut", nameAr: "بيروت", country: "Lebanon", countryAr: "لبنان" },
  // Palestine
  { name: "Jerusalem", nameAr: "القدس", country: "Palestine", countryAr: "فلسطين" },
  { name: "Gaza", nameAr: "غزة", country: "Palestine", countryAr: "فلسطين" },
  // Morocco
  { name: "Casablanca", nameAr: "الدار البيضاء", country: "Morocco", countryAr: "المغرب" },
  { name: "Rabat", nameAr: "الرباط", country: "Morocco", countryAr: "المغرب" },
  // Tunisia
  { name: "Tunis", nameAr: "تونس", country: "Tunisia", countryAr: "تونس" },
  // Algeria
  { name: "Algiers", nameAr: "الجزائر", country: "Algeria", countryAr: "الجزائر" },
  // Iraq
  { name: "Baghdad", nameAr: "بغداد", country: "Iraq", countryAr: "العراق" },
  { name: "Basra", nameAr: "البصرة", country: "Iraq", countryAr: "العراق" },
  // Syria
  { name: "Damascus", nameAr: "دمشق", country: "Syria", countryAr: "سوريا" },
  { name: "Aleppo", nameAr: "حلب", country: "Syria", countryAr: "سوريا" },
];

const PRAYER_NAMES = [
  { key: "Fajr", nameAr: "الفجر", icon: "🌅" },
  { key: "Sunrise", nameAr: "الشروق", icon: "☀️" },
  { key: "Dhuhr", nameAr: "الظهر", icon: "🌞" },
  { key: "Asr", nameAr: "العصر", icon: "🌤️" },
  { key: "Maghrib", nameAr: "المغرب", icon: "🌇" },
  { key: "Isha", nameAr: "العشاء", icon: "🌙" },
];

export default function PrayerTimesPage() {
  const [selectedCity, setSelectedCity] = useState<City>(CITIES[0]);
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch prayer times when city changes
  useEffect(() => {
    const fetchPrayerTimes = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/prayer-times?city=${encodeURIComponent(selectedCity.name)}&country=${encodeURIComponent(selectedCity.country)}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch prayer times");
        }
        const data = await response.json();
        setPrayerData(data);
      } catch (err) {
        setError("حدث خطأ أثناء جلب مواقيت الصلاة");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, [selectedCity]);

  // Filter cities based on search query
  const filteredCities = CITIES.filter(
    (city) =>
      city.nameAr.includes(searchQuery) ||
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.countryAr.includes(searchQuery)
  );

  const formatTime = (time24: string) => {
    const [hours, minutes] = time24.split(":");
    return `${hours}:${minutes}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">مواعيد الصلاه</h1>
          <p className="text-muted-foreground">اعرف مواقيت الصلاة في مدينتك</p>
        </div>

        {/* City Selection */}
        <div className="mb-6">
          <div className="flex items-center justify-between rounded-lg border bg-card p-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-md px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90" style={{ backgroundColor: '#054e49' }}
            >
              تغيير
            </button>
            <div className="text-right">
              <div className="text-lg font-bold">{selectedCity.nameAr}</div>
              <div className="text-sm text-muted-foreground">{selectedCity.countryAr}</div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setIsModalOpen(false)}>
            <div className="w-full max-w-2xl rounded-lg bg-background p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex items-center justify-between">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md p-2 transition-colors hover:bg-accent"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h2 className="text-xl font-bold">اختر المدينة</h2>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="ابحث عن مدينة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border bg-background px-4 py-2 pr-10 text-right focus:outline-none focus:ring-2" style={{ '--tw-ring-color': '#054e49' } as any}
                />
                <svg
                  className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Cities Grid */}
              <div className="grid max-h-96 gap-2 overflow-y-auto rounded-lg border p-3 sm:grid-cols-2 md:grid-cols-3">
                {filteredCities.map((city) => (
                  <button
                    key={`${city.name}-${city.country}`}
                    onClick={() => {
                      setSelectedCity(city);
                      setIsModalOpen(false);
                      setSearchQuery("");
                    }}
                    className="rounded-md px-3 py-2.5 text-right text-sm transition-colors"
                    style={{
                      backgroundColor: selectedCity.name === city.name && selectedCity.country === city.country ? '#054e49' : '',
                      color: selectedCity.name === city.name && selectedCity.country === city.country ? 'white' : '',
                    }}
                  >
                    <div className="font-medium">{city.nameAr}</div>
                    <div className="text-xs opacity-75">{city.countryAr}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" style={{ borderColor: '#054e49 transparent #054e49 #054e49' }}></div>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-600 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        ) : prayerData ? (
          <div className="space-y-6">
            {/* City & Time Info */}
            <div className="rounded-lg border bg-card p-6">
              <div className="text-center">
                <h2 className="mb-2 text-xl font-bold">
                  {selectedCity.nameAr}، {selectedCity.countryAr}
                </h2>
                <div className="mb-3 text-4xl font-bold" style={{ color: '#054e49' }}>
                  {currentTime.toLocaleTimeString("ar-EG", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    timeZone: prayerData.meta.timezone,
                  })}
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>
                    {prayerData.date.hijri.date} {prayerData.date.hijri.month.ar}{" "}
                    {prayerData.date.hijri.year} هـ
                  </p>
                  <p>{prayerData.date.readable}</p>
                </div>
              </div>
            </div>

            {/* Prayer Times */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {PRAYER_NAMES.map((prayer) => (
                <div
                  key={prayer.key}
                  className="rounded-lg border bg-card p-4 transition-colors" style={{ '--tw-border-opacity': '1' } as any} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#054e49'} onMouseLeave={(e) => e.currentTarget.style.borderColor = ''}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-right">
                      <div className="mb-1 text-sm font-medium text-muted-foreground">
                        {prayer.nameAr}
                      </div>
                      <div className="text-2xl font-bold">
                        {formatTime(prayerData.timings[prayer.key as keyof PrayerTimes])}
                      </div>
                    </div>
                    <div className="text-3xl">{prayer.icon}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
