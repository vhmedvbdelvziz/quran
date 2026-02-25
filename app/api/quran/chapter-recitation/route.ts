import { NextResponse } from "next/server";

const API_BASE = "https://api.quran.com/api/v4";
const AUDIO_BASE = "https://verses.quran.com/";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const recitationId = Number(searchParams.get("recitationId"));
  const sura = Number(searchParams.get("sura"));

  if (!recitationId || Number.isNaN(recitationId) || !sura || Number.isNaN(sura)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const response = await fetch(`${API_BASE}/chapter_recitations/${recitationId}/${sura}`);
    if (!response.ok) {
      throw new Error("chapter-recitation");
    }

    const data = (await response.json()) as {
      audio_file?: { audio_url?: string; url?: string };
      audio_files?: { audio_url?: string; url?: string }[];
    };

    const audioFromObject = data.audio_file?.audio_url ?? data.audio_file?.url;
    const audioFromList = data.audio_files?.[0]?.audio_url ?? data.audio_files?.[0]?.url;
    const rawUrl = audioFromObject ?? audioFromList;

    if (!rawUrl) {
      return NextResponse.json({ error: "Audio not available" }, { status: 404 });
    }

    const url = rawUrl.startsWith("http") ? rawUrl : `${AUDIO_BASE}${rawUrl}`;
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: "Failed to load chapter recitation" }, { status: 500 });
  }
}
