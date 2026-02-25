"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/site-header";

interface Zikr {
  id: number;
  text: string;
  count: number;
  description?: string;
}

interface Category {
  id: string;
  name: string;
  azkar: Zikr[];
}

const AZKAR_DATA: Category[] = [
  {
    id: "morning",
    name: "أذكار الصباح",
    azkar: [
      {
        id: 1,
        text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ",
        count: 1,
      },
      {
        id: 2,
        text: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ",
        count: 1,
      },
      {
        id: 3,
        text: "أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ، وَعَلَى كَلِمَةِ الْإِخْلَاصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ",
        count: 1,
      },
      {
        id: 4,
        text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
        count: 100,
        description: "من قالها مائة مرة حطت خطاياه وإن كانت مثل زبد البحر",
      },
      {
        id: 5,
        text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        count: 10,
        description: "من قالها عشر مرات كان كمن أعتق أربعة أنفس من ولد إسماعيل",
      },
      {
        id: 6,
        text: "أَعُوذُ بِاللَّهِ السَّمِيعِ الْعَلِيمِ مِنَ الشَّيْطَانِ الرَّجِيمِ، مِنْ هَمْزِهِ وَنَفْخِهِ وَنَفْثِهِ",
        count: 3,
      },
      {
        id: 7,
        text: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
        count: 3,
        description: "من قالها ثلاثاً لم يضره شيء",
      },
    ],
  },
  {
    id: "evening",
    name: "أذكار المساء",
    azkar: [
      {
        id: 1,
        text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا",
        count: 1,
      },
      {
        id: 2,
        text: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ",
        count: 1,
      },
      {
        id: 3,
        text: "أَمْسَيْنَا عَلَى فِطْرَةِ الْإِسْلَامِ، وَعَلَى كَلِمَةِ الْإِخْلَاصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ",
        count: 1,
      },
      {
        id: 4,
        text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
        count: 100,
      },
      {
        id: 5,
        text: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
        count: 3,
      },
    ],
  },
  {
    id: "sleep",
    name: "أذكار النوم",
    azkar: [
      {
        id: 1,
        text: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
        count: 1,
      },
      {
        id: 2,
        text: "اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا",
        count: 1,
      },
      {
        id: 3,
        text: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا، وَكَفَانَا، وَآوَانَا، فَكَمْ مِمَّنْ لَا كَافِيَ لَهُ وَلَا مُؤْوِيَ",
        count: 1,
      },
      {
        id: 4,
        text: "اللَّهُمَّ إِنِّي أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَوَجَّهْتُ وَجْهِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةً وَرَهْبَةً إِلَيْكَ، لَا مَلْجَأَ وَلَا مَنْجَا مِنْكَ إِلَّا إِلَيْكَ، آمَنْتُ بِكِتَابِكَ الَّذِي أَنْزَلْتَ، وَبِنَبِيِّكَ الَّذِي أَرْسَلْتَ",
        count: 1,
      },
      {
        id: 5,
        text: "سُبْحَانَ اللَّهِ",
        count: 33,
      },
      {
        id: 6,
        text: "الْحَمْدُ لِلَّهِ",
        count: 33,
      },
      {
        id: 7,
        text: "اللَّهُ أَكْبَرُ",
        count: 34,
      },
    ],
  },
  {
    id: "after-prayer",
    name: "أذكار بعد الصلاة",
    azkar: [
      {
        id: 1,
        text: "أَسْتَغْفِرُ اللَّهَ",
        count: 3,
      },
      {
        id: 2,
        text: "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ",
        count: 1,
      },
      {
        id: 3,
        text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ",
        count: 1,
      },
      {
        id: 4,
        text: "سُبْحَانَ اللَّهِ",
        count: 33,
      },
      {
        id: 5,
        text: "الْحَمْدُ لِلَّهِ",
        count: 33,
      },
      {
        id: 6,
        text: "اللَّهُ أَكْبَرُ",
        count: 33,
      },
      {
        id: 7,
        text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        count: 1,
      },
    ],
  },
  {
    id: "general",
    name: "أذكار عامة",
    azkar: [
      {
        id: 1,
        text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
        count: 1,
        description: "كلمتان خفيفتان على اللسان، ثقيلتان في الميزان، حبيبتان إلى الرحمن",
      },
      {
        id: 2,
        text: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
        count: 1,
        description: "كنز من كنوز الجنة",
      },
      {
        id: 3,
        text: "سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ",
        count: 1,
        description: "أحب الكلام إلى الله",
      },
      {
        id: 4,
        text: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ",
        count: 1,
        description: "من صلى عليّ صلاة صلى الله عليه بها عشراً",
      },
      {
        id: 5,
        text: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
        count: 7,
        description: "من قالها سبع مرات كفاه الله ما أهمه",
      },
    ],
  },
  {
    id: "food",
    name: "أذكار الطعام",
    azkar: [
      {
        id: 1,
        text: "بِسْمِ اللَّهِ",
        count: 1,
        description: "عند البدء بالطعام",
      },
      {
        id: 2,
        text: "بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ",
        count: 1,
        description: "إذا نسي أن يسمي في أوله",
      },
      {
        id: 3,
        text: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا، وَجَعَلَنَا مُسْلِمِينَ",
        count: 1,
        description: "بعد الانتهاء من الطعام",
      },
    ],
  },
];

export default function AzkarPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>(AZKAR_DATA[0].id);

  const currentCategory = AZKAR_DATA.find((cat) => cat.id === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8">
        {/* Sidebar - Categories (على اليمين) */}
        <aside className="w-64 shrink-0">
          <div className="sticky top-8 space-y-2 rounded-lg border bg-card p-4">
            <h2 className="mb-4 text-lg font-bold">الأقسام</h2>
            {AZKAR_DATA.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full rounded-md px-4 py-2.5 text-right text-sm font-medium transition-colors`}
                style={{
                  backgroundColor: selectedCategory === category.id ? '#054e49' : '',
                  color: selectedCategory === category.id ? 'white' : '',
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content - Azkar (على الشمال) */}
        <main className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">{currentCategory?.name}</h1>
            <p className="mt-2 text-muted-foreground">
              {currentCategory?.azkar.length} ذكر
            </p>
          </div>

          <div className="space-y-4">
            {currentCategory?.azkar.map((zikr, index) => (
              <div
                key={zikr.id}
                className="rounded-lg border bg-card p-6 transition-colors" onMouseEnter={(e) => e.currentTarget.style.borderColor = '#054e49'} onMouseLeave={(e) => e.currentTarget.style.borderColor = ''}
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: '#054e49' }}>
                    {index + 1}
                  </div>
                  {zikr.count > 1 && (
                    <div className="rounded-full px-3 py-1 text-sm font-medium" style={{ backgroundColor: 'rgba(5, 78, 73, 0.1)', color: '#054e49' }}>
                      {zikr.count}×
                    </div>
                  )}
                </div>

                <p className="mb-4 text-xl leading-relaxed">{zikr.text}</p>

                {zikr.description && (
                  <div className="rounded-md p-3 text-sm" style={{ backgroundColor: 'rgba(5, 78, 73, 0.1)', color: '#054e49' }}>
                    <span className="font-semibold">الفضل:</span> {zikr.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
