import { NextResponse } from "next/server";

const API_BASE = "https://api.quran.com/api/v4";
const AUDIO_BASE = "https://verses.quran.com/";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const recitationId = Number(searchParams.get("recitationId"));
  const verseKey = searchParams.get("verseKey");

  if (!recitationId || Number.isNaN(recitationId) || !verseKey) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const response = await fetch(`${API_BASE}/recitations/${recitationId}/by_ayah/${verseKey}`);
    if (!response.ok) {
      throw new Error("recitation");
    }

    const data = (await response.json()) as { audio_files: { url: string }[] };
    const file = data.audio_files?.[0];

    if (!file?.url) {
      return NextResponse.json({ error: "Audio not available" }, { status: 404 });
    }

    const url = file.url.startsWith("http") ? file.url : `${AUDIO_BASE}${file.url}`;
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: "Failed to load recitation" }, { status: 500 });
  }
}
