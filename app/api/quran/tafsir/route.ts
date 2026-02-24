import { NextResponse } from "next/server";

const API_BASE = "https://api.quran.com/api/v4";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tafsirId = Number(searchParams.get("tafsirId"));
  const verseKey = searchParams.get("verseKey");

  if (!tafsirId || Number.isNaN(tafsirId) || !verseKey) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const response = await fetch(`${API_BASE}/tafsirs/${tafsirId}/by_ayah/${verseKey}`);
    if (!response.ok) {
      throw new Error("tafsir");
    }

    const data = (await response.json()) as {
      tafsir: { text: string; resource_name: string; translated_name?: { name: string } };
    };

    return NextResponse.json({
      text: data.tafsir.text,
      resourceName: data.tafsir.resource_name,
      translatedName: data.tafsir.translated_name?.name ?? null,
    });
  } catch {
    return NextResponse.json({ error: "Failed to load tafsir" }, { status: 500 });
  }
}
